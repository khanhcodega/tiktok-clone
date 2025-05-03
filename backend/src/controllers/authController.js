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

exports.updateProfile = async (req, res, next) => {
  const { username, name, bio } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const updateData = {};

    if (username && username !== user.username) {
      const existingUser = await User.findOne({
        username: username,
        _id: { $ne: userId }
      });
      if (existingUser) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res
          .status(400)
          .json({ success: false, message: "Username already taken" });
      }

      const usernameRegex = /^[a-zA-Z0-9_.]+$/;
      if (!usernameRegex.test(username)) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Username can only contain letters, numbers, underscores, and periods."
          });
      }
      updateData.username = username;

      if (user.nickname === user.username) {
        updateData.nickname = username;
      }
    }

    if (name && name !== user.name) {
      if (name.length > 50) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res
          .status(400)
          .json({
            success: false,
            message: "Name cannot exceed 50 characters."
          });
      }
      updateData.name = name;
    }

    if (bio !== undefined && bio !== user.bio) {
      if (bio.length > 80) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res
          .status(400)
          .json({
            success: false,
            message: "Bio cannot exceed 80 characters."
          });
      }
      updateData.bio = bio;
    }

    let oldAvatarPath = null;
    if (req.file) {
      if (user.avatar && user.avatar !== "default_avatar.png") {
        oldAvatarPath = path.join(
          __dirname,
          "..",
          "public",
          "avatar",
          user.avatar
        );
      }
      updateData.avatar = req.file.filename;
    }

    if (Object.keys(updateData).length === 0) {
      if (!req.file) {
        return res
          .status(200)
          .json({
            success: true,
            message: "No changes detected",
            user: user.toObjectWithoutPassword()
          });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedUser) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res
        .status(404)
        .json({ success: false, message: "User not found during update." });
    }

    if (oldAvatarPath) {
      fs.unlink(oldAvatarPath, (err) => {
        if (err) {
          console.error("Error deleting old avatar:", oldAvatarPath, err);
        } else {
          console.log("Successfully deleted old avatar:", oldAvatarPath);
        }
      });
    }

    const userResponse = updatedUser.toObject();
    user.toObjectWithoutPassword();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userResponse
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr)
          console.error(
            "Error deleting uploaded file after failure:",
            req.file.path,
            unlinkErr
          );
      });
    }

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(". ") });
    }
    if (err instanceof multer.MulterError) {
      return res
        .status(400)
        .json({ success: false, message: `File Upload Error: ${err.message}` });
    }
    if (err.message.startsWith("Not an image!")) {
      return res.status(400).json({ success: false, message: err.message });
    }

    res
      .status(500)
      .json({ success: false, message: "Server Error during profile update" });
  }
};
