// controllers/users.controllers.js
import { UsersService } from "../services/users.service.js";

export const createUser = async (req, res) => {
  try {
    const data = await UsersService.createUser(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const data = await UsersService.getUsers();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await UsersService.getUserById(userId);
    if (!data) {
      return res.status(404).json({ success: false, message: "Không tìm thấy user" });
    }
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await UsersService.updateUser(userId, req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await UsersService.deleteUser(userId);
    res.json({ success: true, message: "Xóa user thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
