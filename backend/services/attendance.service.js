import db from "../config/firebase.js";
import { calculateWorkTime } from "../utils/time.js";

export const handleCheckInService = async (userId) => {
  if (!userId) throw new Error("Missing userId");

  const today = new Date().toISOString().split("T")[0];
  const docId = `${userId}_${today}`;

  const ref = db.collection("attendance").doc(docId);
  const doc = await ref.get();

  if (doc.exists) {
    throw new Error("Hôm nay đã check-in rồi");
  }

  await ref.set({
    userId,
    date: today,
    checkInAt: new Date().toISOString(),
    checkOutAt: null
  });

  return { docId };
};

export const handleCheckOutService = async (userId) => {
  if (!userId) throw new Error("Missing userId");

  const today = new Date().toISOString().split("T")[0];
  const docId = `${userId}_${today}`;

  const ref = db.collection("attendance").doc(docId);
  const doc = await ref.get();

  if (!doc.exists) throw new Error("Chưa check-in hôm nay");
  if (doc.data().checkOutAt) throw new Error("Bạn đã check-out rồi");

  await ref.update({
    checkOutAt: new Date().toISOString()
  });

  return { docId };
};

export const fetchHistoryService = async (userId) => {
  const query = await db
    .collection("attendance")
    .where("userId", "==", userId)
    .orderBy("date", "desc")
    .get();

  return query.docs.map((doc) => {
    const data = doc.data();
    const workTime = data.checkInAt && data.checkOutAt
      ? calculateWorkTime(data.checkInAt, data.checkOutAt)
      : null;

    return {
      id: doc.id,
      ...data,
      workTime
    };
  });
};

export const fetchSummaryService = async (userId) => {
  const query = await db
    .collection("attendance")
    .where("userId", "==", userId)
    .get();

  const records = query.docs.map(doc => doc.data());

  let workDays = 0;
  let absentDays = 0;

  records.forEach(r => {
    if (r.checkInAt && r.checkOutAt) workDays++;
    else absentDays++;
  });

  return {
    workDays,
    absentDays,
    totalRecords: records.length
  };
};
