// controllers/attendance.admin.controllers.js
import { AttendanceAdminService } from "../services/attendance.admin.service.js";

export const adminGetAttendanceDetail = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const data = await AttendanceAdminService.getOne(attendanceId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const adminUpdateAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const updateData = req.body;

    const data = await AttendanceAdminService.update(attendanceId, updateData);

    res.json({
      success: true,
      message: "Cập nhật chấm công thành công",
      data
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
