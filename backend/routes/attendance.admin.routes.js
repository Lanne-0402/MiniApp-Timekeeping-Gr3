// routes/attendance.admin.routes.js
import { Router } from "express";
import { adminOnly } from "../middleware/admin.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  adminUpdateAttendance,
  adminGetAttendanceDetail
} from "../controllers/attendance.admin.controllers.js";

const router = Router();

// Admin xem chi tiết 1 attendance
router.get("/:attendanceId", authMiddleware, adminOnly, adminGetAttendanceDetail);

// Admin cập nhật attendance
router.patch("/:attendanceId", authMiddleware, adminOnly, adminUpdateAttendance);

export default router;
