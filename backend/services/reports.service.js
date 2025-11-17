// services/reports.service.js
import db from "../config/firebase.js";
import { v4 as uuidv4 } from "uuid";

export const ReportsService = {
  async createReport(data) {
    const { title, content, fromDate, toDate } = data;
    if (!title || !fromDate || !toDate) {
      throw new Error("Thiếu dữ liệu báo cáo");
    }

    const id = uuidv4();
    const now = new Date();

    const docData = {
      id,
      title,
      content: content || "",
      fromDate,  // "YYYY-MM-DD"
      toDate,
      status: "pending", // pending | approved | rejected
      createdAt: now,
      updatedAt: now
    };

    await db.collection("reports").doc(id).set(docData);
    return docData;
  },

  async getReports() {
    const snap = await db
      .collection("reports")
      .orderBy("createdAt", "desc")
      .get();

    return snap.docs.map(d => d.data());
  },

  async updateStatus(reportId, status) {
    if (!["approved", "rejected"].includes(status)) {
      throw new Error("Trạng thái không hợp lệ");
    }

    const ref = db.collection("reports").doc(reportId);
    const doc = await ref.get();
    if (!doc.exists) throw new Error("Không tìm thấy báo cáo");

    const now = new Date();

    const updateData = {
      status,
      updatedAt: now
    };

    await ref.update(updateData);

    return { id: reportId, ...doc.data(), ...updateData };
  }
};
