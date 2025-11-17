import { Router } from "express";
import { loginUser, refreshToken, logoutUser, registerUser } from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// 🔵 Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Refresh
router.post("/refresh", refreshToken);

// Logout
router.post("/logout", authMiddleware, logoutUser);

export default router;
