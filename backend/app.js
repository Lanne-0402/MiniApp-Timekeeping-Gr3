import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { adminOnly } from "./middleware/admin.middleware.js";  

dotenv.config();

// Import routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import leavesRoutes from "./routes/leaves.routes.js";
import shiftsRoutes from "./routes/shifts.routes.js";
import reportsRoutes from "./routes/reports.routes.js";
import requestsRoutes from "./routes/requests.routes.js";
import adminAttendanceRoutes from "./routes/attendance.admin.routes.js";




const app = express();


app.use(express.json());
app.use(cors());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Timekeeping API is running" });
});

// Public routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Protected routes
app.use("/api/attendance", authMiddleware, attendanceRoutes);
app.use("/api/leaves", authMiddleware, leavesRoutes);
app.use("/api/shifts", authMiddleware, shiftsRoutes);
app.use("/api/reports", authMiddleware, reportsRoutes);
app.use("/api/requests", authMiddleware, requestsRoutes);
app.use("/api/admin/attendance", authMiddleware, adminOnly, adminAttendanceRoutes);

// 404 fallback
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
