// controllers/shifts.controllers.js
import { ShiftsService } from "../services/shifts.service.js";

export const createShift = async (req, res) => {
  try {
    const data = await ShiftsService.createShift(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getShifts = async (req, res) => {
  try {
    const data = await ShiftsService.getShifts();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const assignShift = async (req, res) => {
  try {
    const { userId, shiftId, date } = req.body;
    const data = await ShiftsService.assignShift(userId, shiftId, date);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getUserShifts = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await ShiftsService.getUserShifts(userId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
