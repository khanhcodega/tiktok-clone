// routes/authRoutes.js
const express = require("express");
const {
  register,
  login,
  getMe,
  logout
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware"); // Import middleware protect

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe); // Áp dụng middleware protect cho route này
router.get("/logout", protect, logout); // Logout cũng nên yêu cầu đăng nhập

module.exports = router;
