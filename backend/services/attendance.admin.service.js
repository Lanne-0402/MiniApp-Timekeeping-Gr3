// services/attendance.admin.service.js
import db from "../config/firebase.js";

export const AttendanceAdminService = {
  async getOne(attendanceId) {
    const ref = db.collection("attendance").doc(attendanceId);
    const snap = await ref.get();

    if (!snap.exists) {
      throw new Error("Không tìm thấy bản ghi chấm công");
    }

    return snap.data();
  },

  async update(attendanceId, updateData) {
    const ref = db.collection("attendance").doc(attendanceId);
    const snap = await ref.get();

    if (!snap.exists) {
      throw new Error("Không tìm thấy bản ghi chấm công");
    }

    const att = snap.data();

    // Nếu có checkInAt hoặc checkOutAt mới → tính lại workTime
    const checkIn = updateData.checkInAt ?? att.checkInAt;
    const checkOut = updateData.checkOutAt ?? att.checkOutAt;

    let workTime = att.workTime;

    if (checkIn && checkOut) {
      const totalMs = new Date(checkOut) - new Date(checkIn);
      const hours = Math.floor(totalMs / (1000 * 60 * 60));
      const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
      workTime = `${hours}h ${minutes}m`;
    }

    const payload = {
      ...updateData,
      checkInAt: checkIn,
      checkOutAt: checkOut,
      workTime,
      updatedAt: new Date().toISOString()
    };

    await ref.update(payload);

    return payload;
  }
};
