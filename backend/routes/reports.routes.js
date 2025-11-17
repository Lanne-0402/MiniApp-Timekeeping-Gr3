import { Router } from "express";
import {
  createReport,
  getReports,
  updateReportStatus
} from "../controllers/reports.controllers.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = Router();

// Admin tạo báo cáo tổng hợp giờ làm
router.post("/", authMiddleware, adminOnly, createReport);

// Admin xem toàn bộ báo cáo
router.get("/", authMiddleware, adminOnly, getReports);

// Admin cập nhật trạng thái báo cáo
router.patch("/:reportId", authMiddleware, adminOnly, updateReportStatus);

export default router;
