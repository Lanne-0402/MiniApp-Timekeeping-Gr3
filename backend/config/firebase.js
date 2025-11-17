import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const keyPath = process.env.SERVICE_ACCOUNT_KEY_PATH;

if (!keyPath) {
  console.warn("SERVICE_ACCOUNT_KEY_PATH is not set – Firestore disabled");
}

let db = null;

try {
  const absolutePath = path.resolve(process.cwd(), keyPath);

  const serviceAccount = JSON.parse(fs.readFileSync(absolutePath, "utf8"));

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }

  db = admin.firestore();
  console.log("Firestore initialized");
} catch (err) {
  console.warn("Running without Firestore connection:", err.message);
}

export default db;
