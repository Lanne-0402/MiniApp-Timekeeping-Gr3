import db from "../config/firebase.js";
import { v4 as uuidv4 } from "uuid";

export const LeavesService = {
  async create(data) {
    const id = uuidv4();

    const leaveData = {
      id,
      userId: data.userId,
      reason: data.reason,
      date: data.date,         // "2025-01-22"
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection("leaves").doc(id).set(leaveData);
    return leaveData;
  },

  async getByUser(userId) {
    const snap = await db.collection("leaves")
      .where("userId", "==", userId)
      .orderBy("date", "desc")
      .get();

    return snap.docs.map((doc) => doc.data());
  },

  async getAll() {
    const snap = await db.collection("leaves").get();
    return snap.docs.map((d) => d.data());
  },

  async updateStatus(leaveId, status) {
    const ref = db.collection("leaves").doc(leaveId);
    const doc = await ref.get();

    if (!doc.exists) throw new Error("Leave request not found");

    await ref.update({
      status,
      updatedAt: new Date()
    });

    return { id: leaveId, status };
  }
};
