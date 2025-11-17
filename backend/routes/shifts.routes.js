import { Router } from "express";
import {
  createShift,
  getShifts,
  assignShift,
  getUserShifts
} from "../controllers/shifts.controllers.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = Router();

// Admin tạo ca làm
router.post("/", authMiddleware, adminOnly, createShift);

// Admin xem tất cả ca làm (hoặc ai cũng xem tùy bạn)
router.get("/", authMiddleware, adminOnly, getShifts);

// Admin gán ca làm cho nhân viên
router.post("/assign", authMiddleware, adminOnly, assignShift);

// Nhân viên xem ca làm của chính mình
router.get("/user/:userId", authMiddleware, getUserShifts);

export default router;
