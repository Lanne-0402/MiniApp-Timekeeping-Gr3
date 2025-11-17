// services/requests.service.js
import db from "../config/firebase.js";
import { v4 as uuidv4 } from "uuid";

export const RequestsService = {
  async create(userId, payload) {
    const {
      type,        
      date,        
      oldCheckIn,
      oldCheckOut,
      newCheckIn,
      newCheckOut,
      reason
    } = payload;

    if (!type || !date || !reason) {
      throw new Error("Thiếu dữ liệu bắt buộc");
    }

    if (!["edit", "complaint"].includes(type)) {
      throw new Error("Loại yêu cầu không hợp lệ");
    }

    const id = uuidv4();
    const now = new Date();

    const docData = {
      id,
      userId,
      type,
      date,
      oldCheckIn: oldCheckIn || null,
      oldCheckOut: oldCheckOut || null,
      newCheckIn: newCheckIn || null,
      newCheckOut: newCheckOut || null,
      reason,
      status: "pending",
      adminNote: null,
      resolvedBy: null,
      resolvedAt: null,
      createdAt: now,
      updatedAt: now
    };

    await db.collection("requests").doc(id).set(docData);
    return docData;
  },

  async getByUser(userId) {
    const snap = await db
      .collection("requests")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    return snap.docs.map(d => d.data());
  },

  async getAll() {
    const snap = await db
      .collection("requests")
      .orderBy("createdAt", "desc")
      .get();

    return snap.docs.map(d => d.data());
  },

  async updateStatus(requestId, status, adminId, adminNote) {
    if (!["approved", "rejected"].includes(status)) {
      throw new Error("Trạng thái không hợp lệ");
    }

    const ref = db.collection("requests").doc(requestId);
    const doc = await ref.get();

    if (!doc.exists) throw new Error("Không tìm thấy yêu cầu");

    const request = doc.data();
    const now = new Date();

    // ---- 1) Update trạng thái request ----
    const updateData = {
      status,
      adminNote: adminNote || null,
      resolvedBy: adminId,
      resolvedAt: now,
      updatedAt: now
    };

    await ref.update(updateData);

    // ---- 2) APPLY REQUEST NẾU APPROVED ----
    if (status === "approved" && request.type === "edit") {
      const attendanceId = `${request.userId}_${request.date}`;
      const attendanceRef = db.collection("attendance").doc(attendanceId);
      const attSnap = await attendanceRef.get();

      if (!attSnap.exists) {
        throw new Error("Không tìm thấy bản ghi chấm công để cập nhật");
      }

      const att = attSnap.data();

      const newCheckIn = request.newCheckIn ?? att.checkInAt;
      const newCheckOut = request.newCheckOut ?? att.checkOutAt;

      const totalMs =
        new Date(newCheckOut).getTime() - new Date(newCheckIn).getTime();

      const hours = Math.floor(totalMs / (1000 * 60 * 60));
      const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));

      const attendanceUpdate = {
        checkInAt: newCheckIn,
        checkOutAt: newCheckOut,
        workTime: `${hours}h ${minutes}m`,
        updatedAt: new Date().toISOString()
      };

      await attendanceRef.update(attendanceUpdate);
    }

    return { id: requestId, ...request, ...updateData };
  }
};
