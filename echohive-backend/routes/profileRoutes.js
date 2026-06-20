import express from "express";
import multer from "multer";
import fs from "fs";
import User from "../models/User.js";
import Post from "../models/Post.js"; // for fetching posts
import cloudinary from "../config/cloudinary.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// --- GET user profile ---
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("-password") // exclude sensitive info
      .lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Fetch profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- GET user posts ---
router.get("/:userId/posts", async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId }).sort({ createdAt: -1 });
    res.json({ posts });
  } catch (err) {
    console.error("Fetch posts error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- UPDATE user profile ---
router.put("/:userId", upload.single("avatar"), async (req, res) => {
  const { fullName, username, bio, details } = req.body;

  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (fullName) user.fullName = fullName;
    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (details) user.details = details;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pictures",
      });
      user.avatar = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        bio: user.bio,
        avatar: user.avatar,
        details: user.details,
      },
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
