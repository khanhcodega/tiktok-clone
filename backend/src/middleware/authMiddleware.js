const jwt = require("jsonwebtoken");
const User = require("../models/User");

require("dotenv").config();

exports.protect = async (req, res, next) => {
  let token;

  // Kiểm tra xem header Authorization có tồn tại và bắt đầu bằng 'Bearer' không
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Lấy token từ header (Bearer <token>)
    token = req.headers.authorization.split(" ")[1];
  }
  // else if (req.cookies.token) { // Hoặc lấy từ cookie nếu bạn dùng cookie
  //   token = req.cookies.token;
  // }

  // Đảm bảo token tồn tại
  if (!token) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Not authorized to access this route (no token)"
      });
  }

  try {
    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user dựa trên id trong token và gắn vào req.user
    // Bỏ qua password khi lấy thông tin user
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, user not found" });
    }

    next(); // Cho phép đi tiếp tới route handler
  } catch (err) {
    console.error("Token verification error:", err);
    return res
      .status(401)
      .json({
        success: false,
        message: "Not authorized to access this route (invalid token)"
      });
  }
};

// (Tùy chọn) Middleware kiểm tra quyền admin (nếu cần)
// exports.authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ success: false, message: `User role ${req.user.role} is not authorized to access this route` });
//     }
//     next();
//   };
// };
