import { AuthService } from "../services/auth.service.js";
import { UsersService } from "../services/users.service.js";

// 🔵 Register → Create User → Auto Login → Return Tokens
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin đăng ký" });
    }

    // 1) Tạo user mới (role mặc định = employee)
    const newUser = await UsersService.createUser({
      name,
      email,
      password,
      role: "employee"
    });

    // 2) Login tự động
    const loginResult = await AuthService.login(email, password);

    // 3) Trả về token + user
    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      data: loginResult.user,
      accessToken: loginResult.accessToken,
      refreshToken: loginResult.refreshToken
    });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// giữ refresh, logout như cũ
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await AuthService.refresh(refreshToken);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const result = await AuthService.logout(userId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
