const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email"
      ],
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false
    },

    name: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      trim: true
    },
    nickname: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      trim: true
    },
    followings: {
      user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
      createdAt: { type: Date, default: Date.now }
    },
    avatar: {
      type: String,
      default: "default_avatar.png"
    }
  },
  {
    timestamps: true
  }
);

// Middleware: Mã hóa mật khẩu trước khi lưu
User.pre("save", async function (next) {
  // Chỉ hash password nếu nó được thay đổi (hoặc là user mới)
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method: So sánh mật khẩu nhập vào với mật khẩu đã hash trong DB
User.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", User);
