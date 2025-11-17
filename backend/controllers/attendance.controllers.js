import {
  handleCheckInService,
  handleCheckOutService,
  fetchHistoryService,
  fetchSummaryService
} from "../services/attendance.service.js";

export const checkIn = async (req, res) => {
  try {
    const userId = req.user.userId; // lấy từ token
    const result = await handleCheckInService(userId);
    res.json({ success: true, message: "Check-in thành công", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkOut = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await handleCheckOutService(userId);
    res.json({ success: true, message: "Check-out thành công", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = await fetchHistoryService(userId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSummary = async (req, res) => {
  try {
    const userId = req.params.userId;
    const summary = await fetchSummaryService(userId);
    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
