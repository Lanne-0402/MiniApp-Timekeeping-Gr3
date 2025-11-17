import db from "../config/firebase.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const AuthService = {
  async login(email, password) {
    if (!email || !password) throw new Error("Missing email or password");

    const snap = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (snap.empty) throw new Error("Invalid email or password");

    const doc = snap.docs[0];
    const user = doc.data();
    const userId = user.id || doc.id;

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid email or password");

    const accessToken = jwt.sign(
      { userId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "1h" }
    );

    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d" }
    );

    await db.collection("refreshTokens").doc(userId).set({
      token: refreshToken,
      createdAt: new Date(),
    });

    const safeUser = { ...user, id: userId };
    delete safeUser.password;

    return { user: safeUser, accessToken, refreshToken };
  },

  async refresh(refreshToken) {
    if (!refreshToken) throw new Error("Missing refresh token");

    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      throw new Error("Invalid or expired refresh token");
    }

    const saved = await db.collection("refreshTokens").doc(payload.userId).get();
    if (!saved.exists || saved.data().token !== refreshToken) {
      throw new Error("Refresh token revoked or not found");
    }

    // lấy role mới nhất từ users
    const userDoc = await db.collection("users").doc(payload.userId).get();
    if (!userDoc.exists) throw new Error("User not found");

    const user = userDoc.data();
    const role = user.role || "employee";

    const newAccessToken = jwt.sign(
      { userId: payload.userId, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "1h" }
    );

    return { accessToken: newAccessToken };
  },

  async logout(userId) {
    if (!userId) throw new Error("Missing userId");
    await db.collection("refreshTokens").doc(userId).delete();
    return { message: "Logged out successfully" };
  },
};
