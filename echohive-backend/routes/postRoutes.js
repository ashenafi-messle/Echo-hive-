import express from "express";
import multer from "multer";
import fs from "fs";
import Post from "../models/Post.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// -----------------------
// GET all posts
// -----------------------
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json({ posts });
  } catch (err) {
    console.error("❌ Error fetching posts:", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

// -----------------------
// CREATE a new post
// -----------------------
router.post("/", upload.single("media"), async (req, res) => {
  try {
    const { userId, content, mediaType } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let mediaUrl = null;
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "posts",
          resource_type:
            mediaType === "video"
              ? "video"
              : mediaType === "audio"
              ? "raw"
              : "image",
        });
        mediaUrl = result.secure_url;
      } catch (err) {
        console.error("❌ Cloudinary upload error:", err);
        return res.status(500).json({ message: "Cloudinary upload failed" });
      } finally {
        fs.unlinkSync(req.file.path);
      }
    }

    const post = await Post.create({
      author: user._id,
      authorName: user.fullName,
      avatar: user.avatar,
      content,
      mediaUrl,
      mediaType,
    });

    res.json({ post });
  } catch (err) {
    console.error("❌ Post creation error:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
});

// -----------------------
// EDIT a post
// -----------------------
router.put("/:id", async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.content = content || post.content;
    await post.save();

    res.json({ post });
  } catch (err) {
    console.error("❌ Post update error:", err);
    res.status(500).json({ message: "Failed to update post" });
  }
});

// -----------------------
// DELETE a post
// -----------------------
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("❌ Post delete error:", err);
    res.status(500).json({ message: "Failed to delete post" });
  }
});

export default router;
