// Phần đầu file routes/videoRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Để tạo thư mục nếu chưa có
const { protect } = require("../middleware/authMiddleware.js");
const {
  uploadVideo,
  getVideos,
  getVideoById,
  likeVideo,
  commentVideo
} = require("../controllers/VideoController.js");

const router = express.Router();

// --- Cấu hình Multer ---
// Đảm bảo thư mục uploads/videos tồn tại
const uploadDir = path.join(__dirname, "..", "uploads", "videos"); // Đường dẫn tuyệt đối an toàn hơn
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Tạo thư mục nếu chưa có, bao gồm cả thư mục cha
  console.log(`Created directory: ${uploadDir}`);
} else {
  console.log(`Upload directory exists: ${uploadDir}`);
}

// Cấu hình nơi lưu trữ file và tên file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Kiểm tra kiểu file (chỉ cho phép video)
    const allowedTypes = /mp4|mov|avi|wmv|mkv/; // Thêm các định dạng video bạn muốn hỗ trợ
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      cb(null, uploadDir); // Lưu vào thư mục uploads/videos
    } else {
      cb(new Error("Error: Video Files Only!"), null); // Trả lỗi nếu không phải video
    }
  },
  filename: function (req, file, cb) {
    // Tạo tên file unique để tránh trùng lặp
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
    // Ví dụ: video-1678886400000.mp4
  }
});

// Khởi tạo middleware upload của multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // Giới hạn dung lượng file 100MB
}).single("video"); // Tên field trong form data gửi lên phải là 'video'

// Middleware xử lý lỗi từ Multer (đặt trước route upload)
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Lỗi từ Multer (ví dụ: file quá lớn)
    console.error("Multer Error:", err.message);
    return res
      .status(400)
      .json({ success: false, message: `Multer error: ${err.message}` });
  } else if (err) {
    // Lỗi khác (ví dụ: loại file không hợp lệ từ check file type)
    console.error("Upload Error:", err.message);
    return res
      .status(400)
      .json({ success: false, message: err.message || "File upload error" });
  }
  // Nếu không có lỗi, tiếp tục
  next();
};

// --- Định nghĩa Routes ---
// Route upload video (áp dụng middleware protect và multer)
router.post("/upload", protect, (req, res, next) => {
  // Gọi middleware upload của multer trước controller
  upload(req, res, (err) => {
    // Xử lý lỗi từ multer bằng middleware đã tạo
    handleMulterError(err, req, res, () => {
      // Nếu không có lỗi upload, gọi controller uploadVideo
      uploadVideo(req, res, next);
    });
  });
});

router.get("/", getVideos); 
router.get("/:id", getVideoById); 
router.put("/:id/like", protect, likeVideo); 
router.post("/:id/comment", protect, commentVideo);

module.exports = router;
