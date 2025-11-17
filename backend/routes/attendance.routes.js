import { Router } from "express";
import {
  checkIn,
  checkOut,
  getHistory,
  getSummary
} from "../controllers/attendance.controllers.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/checkin", authMiddleware, checkIn);
router.post("/checkout", authMiddleware, checkOut);
router.get("/history/:userId", authMiddleware, getHistory);

// NEW: tổng quan 5 ngày làm – 11 ngày nghỉ
router.get("/summary/:userId", authMiddleware, getSummary);

export default router;
