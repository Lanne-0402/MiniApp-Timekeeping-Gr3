// controllers/reports.controllers.js
import { ReportsService } from "../services/reports.service.js";

export const createReport = async (req, res) => {
  try {
    const data = await ReportsService.createReport(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const data = await ReportsService.getReports();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;
    const data = await ReportsService.updateStatus(reportId, status);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
