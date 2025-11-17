import { Router } from "express";
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser
} from "../controllers/users.controllers.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";
import { selfOrAdmin } from "../middleware/selfOrAdmin.middleware.js";

const router = Router();

// User xem chính mình
router.get("/me", authMiddleware, (req, res) => {
  res.json(req.user);
});

// Admin tạo user mới
router.post("/", authMiddleware, adminOnly, createUser);

// Admin xem toàn bộ user
router.get("/", authMiddleware, adminOnly, getUsers);

// Admin hoặc user xem 1 user
router.get("/:userId", authMiddleware, selfOrAdmin, getUser);

// User sửa chính mình hoặc admin sửa bất kỳ ai
router.patch("/:userId", authMiddleware, selfOrAdmin, updateUser);

// Admin xóa user
router.delete("/:userId", authMiddleware, adminOnly, deleteUser);

export default router;

