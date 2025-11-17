// services/shifts.service.js
import db from "../config/firebase.js";
import { v4 as uuidv4 } from "uuid";

export const ShiftsService = {
  async createShift(data) {
    const { name, startTime, endTime } = data;
    if (!name || !startTime || !endTime) {
      throw new Error("Thiếu thông tin ca làm");
    }

    const id = uuidv4();
    const now = new Date();

    const docData = {
      id,
      name,
      startTime, // string "08:00"
      endTime,   // string "17:00"
      createdAt: now,
      updatedAt: now
    };

    await db.collection("shifts").doc(id).set(docData);
    return docData;
  },

  async getShifts() {
    const snap = await db.collection("shifts").get();
    return snap.docs.map(d => d.data());
  },

  async assignShift(userId, shiftId, date) {
    if (!userId || !shiftId || !date) {
      throw new Error("Thiếu dữ liệu phân ca");
    }

    const id = uuidv4();
    const now = new Date();

    const docData = {
      id,
      userId,
      shiftId,
      date,       // "YYYY-MM-DD"
      createdAt: now,
      updatedAt: now
    };

    await db.collection("user_shifts").doc(id).set(docData);
    return docData;
  },

  async getUserShifts(userId) {
    const snap = await db
      .collection("user_shifts")
      .where("userId", "==", userId)
      .orderBy("date", "desc")
      .get();

    return snap.docs.map(d => d.data());
  }
};
