const User = require("../models/User");

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("username avatar");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error("Get User By ID Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
