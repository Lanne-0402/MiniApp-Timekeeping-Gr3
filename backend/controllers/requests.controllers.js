// controllers/requests.controllers.js
import { RequestsService } from "../services/requests.service.js";

export const createRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const data = await RequestsService.create(userId, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const userId = req.user.userId;
    const data = await RequestsService.getByUser(userId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const data = await RequestsService.getAll();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, adminNote } = req.body;
    const adminId = req.user.userId;

    const data = await RequestsService.updateStatus(
      requestId,
      status,
      adminId,
      adminNote
    );

    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
