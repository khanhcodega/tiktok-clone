const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User", 
      required: true
    },
    videoUrl: {
      type: String,
      required: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot be more than 200 characters"]
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User"
      }
    ],
    comments: [
      {
        user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        likes: [
          {
            type: mongoose.Schema.ObjectId,
            ref: "User"
          }
        ],
        createdAt: { type: Date, default: Date.now },
        replies: [
          {
            user: {
              type: mongoose.Schema.ObjectId,
              ref: "User",
              required: true
            },
            text: { type: String, required: true },
            likes: [
              {
                type: mongoose.Schema.ObjectId,
                ref: "User"
              }
            ],
            createdAt: { type: Date, default: Date.now }
          }
        ]
      }
    ]
  },
  {
    timestamps: true 
  }
);

VideoSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Video", VideoSchema);
