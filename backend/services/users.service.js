// services/users.service.js
import db from "../config/firebase.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export const UsersService = {
  async createUser(payload) {
    const { name, email, password, role } = payload;

    if (!name || !email || !password) {
      throw new Error("Thiếu thông tin người dùng");
    }

    const existing = await this.getUserByEmail(email);
    if (existing) {
      throw new Error("Email đã tồn tại");
    }

    const id = uuidv4();
    const now = new Date();
    const hashed = await bcrypt.hash(password, 10);

    const docData = {
      id,
      name,
      email,
      password: hashed,
      role: role || "employee",
      createdAt: now,
      updatedAt: now
    };

    await db.collection("users").doc(id).set(docData);
    return { id, name, email, role: docData.role, createdAt: now };
  },

  async getUsers() {
    const snap = await db.collection("users").get();
    return snap.docs.map(d => {
      const data = d.data();
      delete data.password;
      return data;
    });
  },

  async getUserById(userId) {
    const doc = await db.collection("users").doc(userId).get();
    if (!doc.exists) return null;
    const data = doc.data();
    delete data.password;
    return data;
  },

  async updateUser(userId, payload) {
    const allowed = ["name", "email", "role"];
    const updateData = {};
    allowed.forEach(k => {
      if (payload[k] !== undefined) updateData[k] = payload[k];
    });

    if (Object.keys(updateData).length === 0) {
      throw new Error("Không có gì để cập nhật");
    }

    updateData.updatedAt = new Date();

    await db.collection("users").doc(userId).update(updateData);

    const doc = await db.collection("users").doc(userId).get();
    const data = doc.data();
    delete data.password;
    return data;
  },

  async deleteUser(userId) {
    await db.collection("users").doc(userId).delete();
  },

  async getUserByEmail(email) {
    const snap = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (snap.empty) return null;
    const data = snap.docs[0].data();
    return data;
  }
};
