const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(statusCode).json({
    success: true,
    token,
    user: userResponse
  });
};

exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username, email and password"
      });
    }

    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      const field = user.email === email ? "Email" : "Username";
      return res
        .status(400)
        .json({ success: false, message: `${field} already exists` });
    }

    user = await User.create({
      username,
      email,
      password,
      nickname: username,
      name: username,
      avatar: "default_avatar.png"
    });

    sendTokenResponse(user, 201, res); // 201 Created
  } catch (err) {
    console.error("Register Error:", err);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(". ") });
    }
    res
      .status(500)
      .json({ success: false, message: "Server Error during registration" });
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username: username }]
    }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error("Login Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server Error during login" });
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.logout = async (req, res, next) => {
  res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
};
