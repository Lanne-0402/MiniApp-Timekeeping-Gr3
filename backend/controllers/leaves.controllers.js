import { LeavesService } from "../services/leaves.service.js";

export const createLeaveRequest = async (req, res) => {
  try {
    const userId = req.user.userId;        // luôn lấy từ token
    const { reason, date } = req.body;

    if (!reason || !date)
      return res.status(400).json({ error: "Missing reason or date" });

    const leave = await LeavesService.create({
      userId,
      reason,
      date,
    });

    res.status(201).json(leave);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getLeaveByUser = async (req, res) => {
  try {
    const requestedUserId = req.params.userId;
    const authenticatedUserId = req.user.userId;
    const role = req.user.role;

    // Only self or admin can view
    if (requestedUserId !== authenticatedUserId && role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const leaves = await LeavesService.getByUser(requestedUserId);
    res.json(leaves);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await LeavesService.getAll();
    res.json(leaves);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const result = await LeavesService.updateStatus(leaveId, status);
    res.json(result);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
