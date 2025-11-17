import dotenv from "dotenv";
import bcrypt from "bcrypt";
import db from "../config/firebase.js";

dotenv.config();

const ADMIN_EMAIL = "admin@timekeeping.com";
const ADMIN_PASSWORD = "admin123";
const ADMIN_NAME = "System Admin";

async function createAdmin() {
  try {
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    console.log("🔍 Checking if admin already exists...");

    // Kiểm tra xem admin đã tồn tại chưa
    const snapshot = await db
      .collection("users")
      .where("email", "==", ADMIN_EMAIL)
      .get();

    if (!snapshot.empty) {
      console.log("⚠️ Admin user already exists. No action taken.");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Tạo admin mới
    const adminData = {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
    };

    // Thêm vào Firestore
    await db.collection("users").add(adminData);

    console.log("🎉 Admin created successfully!");
    console.log("📧 Email:", ADMIN_EMAIL);
    console.log("🔑 Password:", ADMIN_PASSWORD);

  } catch (error) {
    console.error("❌ Error creating admin:", error);
  }
}

createAdmin();
