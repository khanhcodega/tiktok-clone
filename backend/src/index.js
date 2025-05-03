// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const routes = require("./routes");
dotenv.config({ path: ".env.local" });

connectDB();

const app = express();

app.use(cors()); // Cho phép Cross-Origin Resource Sharing (quan trọng cho React app)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "uploads")));
console.log(`Serving static files from: ${path.join(__dirname, "uploads")}`);

routes(app);
// Middleware xử lý lỗi (phải đặt sau các routes)
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server Error"
  });
});

const PORT = process.env.PORT || 5000;
// Khởi chạy server
const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});

// Xử lý các lỗi unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
