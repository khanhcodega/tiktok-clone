// controllers/videoController.js
const Video = require("../models/Video");
const User = require("../models/User"); // Có thể cần để populate
const path = require("path");
const fs = require("fs"); // Để xử lý file nếu cần (ví dụ xóa)
require("dotenv").config();

exports.uploadVideo = async (req, res, next) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "Video file is required." });
  }

  const maxSize = 100 * 1024 * 1024;
  if (req.file.size > maxSize) {
    // Xóa file đã tải lên nếu quá lớn
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting oversized file:", err);
    });
    return res.status(400).json({
      success: false,
      message: `File size exceeds the limit of ${maxSize / 1024 / 1024}MB`
    });
  }

  const { description } = req.body;

  const relativeFilePath = path.join("videos", req.file.filename);
  const videoUrl = `${process.env.BASE_URL}/${relativeFilePath}`;

  try {
    const newVideo = await Video.create({
      user: req.user.id,
      videoUrl: videoUrl,
      description: description || ""
    });

    // Populate thông tin user (tùy chọn, để response có đủ thông tin)
    const populatedVideo = await Video.findById(newVideo._id).populate(
      "user",
      "username avatar"
    );

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      data: populatedVideo
    });
  } catch (err) {
    console.error("Video Upload Error:", err);
    fs.unlink(req.file.path, (unlinkErr) => {
      if (unlinkErr) {
        console.error(
          "Error deleting orphaned file after DB error:",
          req.file.path,
          unlinkErr
        );
      } else {
        console.log("Successfully deleted orphaned file:", req.file.path);
      }
    });
    res
      .status(500)
      .json({ success: false, message: "Server Error uploading video" });
  }
};

exports.getVideos = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await Video.countDocuments();

    const videos = await Video.find()
      .populate("user", "username avatar")
      .populate({
        path: "comments", // Populate the comments array
        populate: {
          path: "user", // Populate the user field within each comment
          select: "username avatar name" // Select the fields you need
        }
      })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // Pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: videos.length,
      totalVideos: total,
      pagination,
      data: videos
    });
  } catch (err) {
    console.error("Get Videos Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server Error fetching videos" });
  }
};

exports.getVideoById = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate("user", "username avatar") // Lấy thông tin user đăng
      .populate("comments.user", "username avatar"); // Lấy thông tin user comment

    if (!video) {
      return res.status(404).json({
        success: false,
        message: `Video not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({ success: true, data: video });
  } catch (err) {
    console.error("Get Single Video Error:", err);
    // Xử lý lỗi nếu ID không đúng định dạng ObjectId
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: `Invalid video ID format` });
    }
    res
      .status(500)
      .json({ success: false, message: "Server Error fetching video" });
  }
};

exports.likeVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    const isLiked = video.likes.some((like) => like.toString() === req.user.id);

    if (isLiked) {
      video.likes = video.likes.filter(
        (like) => like.toString() !== req.user.id
      );
      await video.save();
      return res
        .status(200)
        .json({ success: true, message: "Video unliked", likes: video.likes });
    } else {
      // Nếu chưa like -> like (thêm user ID vào mảng likes)
      video.likes.push(req.user.id);
      await video.save();
      return res
        .status(200)
        .json({ success: true, message: "Video liked", likes: video.likes });
    }
  } catch (err) {
    console.error("Like Video Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server Error liking video" });
  }
};

exports.commentVideo = async (req, res, next) => {
  const { text } = req.body;
  if (!text || text.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Comment text cannot be empty" });
  }

  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    const newComment = {
      user: req.user.id,
      text: text
    };

    video.comments.push(newComment);
    await video.save();

    const updatedVideo = await Video.findById(req.params.id).populate(
      "comments.user",
      "username avatar name nickname"
    );

    res.status(201).json({
      success: true,
      message: "Comment added",
      comments: updatedVideo.comments
    });
  } catch (err) {
    console.error("Comment Video Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server Error adding comment" });
  }
};
