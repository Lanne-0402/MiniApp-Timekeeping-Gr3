// =================== DEMO USERS ===================
const DEMO_USERS = [
  {
    email: "quanly@company.com",
    password: "123456",
    role: "manager",
    name: "Amanda Manager",
    dept: "Ban điều hành"
  },
  {
    email: "nhanvien@company.com",
    password: "123456",
    role: "employee",
    name: "Nguyễn Ngọc Gia Hân",
    dept: "Kinh doanh"
  }
];

const DEMO_RESET_CODE = "123456"; // mã demo hiển thị trên màn hình

document.addEventListener("DOMContentLoaded", () => {
  // ===== Map các form =====
  const views = {
    login:    document.getElementById("loginForm"),
    register: document.getElementById("registerForm"),
    reset:    document.getElementById("resetForm"),
    newpass:  document.getElementById("newPassForm")
  };

  function showView(name) {
    Object.values(views).forEach(v => v && v.classList.remove("active"));
    if (views[name]) {
      views[name].classList.add("active");
    }
  }

  // Mặc định hiện login
  showView("login");

  // ===== Nút chuyển form (login / register / reset / newpass) =====
  document.querySelectorAll(".view-switch").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.view;   // đọc data-view="..."
      if (target) showView(target);
    });
  });

  // ===== Đăng nhập =====
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const pass  = document.getElementById("loginPassword").value;

    const user = DEMO_USERS.find(
      u => u.email === email && u.password === pass
    );

    if (!user) {
      alert("Email hoặc mật khẩu không đúng!");
      return;
    }

    // lưu user vào localStorage
    localStorage.setItem("tkUser", JSON.stringify(user));

    // điều hướng theo role
    if (user.role === "manager") {
      window.location.href = "manager.html";
    } else {
      window.location.href = "employee.html";
    }
  });

  // ===== Đăng ký (demo, không lưu thật) =====
  const registerForm = document.getElementById("registerForm");
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Đăng ký demo thành công! Hãy dùng tài khoản demo đã cung cấp để đăng nhập.");
    showView("login");
  });

  // ===== Bước 1: nhập mã xác nhận =====
  const resetForm = document.getElementById("resetForm");
  const resetError = document.getElementById("resetError");

  resetForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const code = document.getElementById("resetCode").value.trim();

    if (code === DEMO_RESET_CODE) {
      // mã đúng → ẩn lỗi, xóa input, sang bước nhập mật khẩu mới
      resetError.style.display = "none";
      document.getElementById("resetCode").value = "";
      showView("newpass");
    } else {
      // mã sai → chỉ báo lỗi, KHÔNG chuyển trang
      resetError.textContent = "Mã xác nhận sai. Vui lòng thử lại.";
      resetError.style.display = "block";
    }
  });

  // ===== Bước 2: nhập mật khẩu mới =====
  const newPassForm  = document.getElementById("newPassForm");
  const newPassError = document.getElementById("newPassError");

  newPassForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const p1 = document.getElementById("newPass").value;
    const p2 = document.getElementById("newPass2").value;

    if (p1.length < 6) {
      newPassError.textContent = "Mật khẩu mới phải ít nhất 6 ký tự.";
      newPassError.style.display = "block";
      return;
    }
    if (p1 !== p2) {
      newPassError.textContent = "Mật khẩu nhập lại không khớp.";
      newPassError.style.display = "block";
      return;
    }

    newPassError.style.display = "none";
    alert("Đã đặt lại mật khẩu (demo). Hãy đăng nhập lại.");
    showView("login");
  });
});
