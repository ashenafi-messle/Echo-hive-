// routes/story.js
import express from "express";
import multer from "multer";
import fs from "fs";
import Story from "../models/Story.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

// ✅ formatter function for consistent API response
const formatStory = (story) => ({
  _id: story._id,
  userId: story.author,
  name: story.authorName,
  avatar: story.avatar,
  media: story.mediaUrl,
  mediaType: story.mediaType,
  content: story.content || "",
  likes: story.likes || 0,
  likesUsers: story.likesUsers || [],
  comments: story.comments || [],
  createdAt: story.createdAt,
});

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ✅ GET all stories
router.get("/", async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json({ stories: stories.map(formatStory) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stories" });
  }
});

// ✅ GET single story
router.get("/:id", async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    res.json({ story: formatStory(story) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch story" });
  }
});

// ✅ CREATE story
router.post("/", upload.single("media"), async (req, res) => {
  try {
    const { userId, mediaType, content } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let mediaUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "stories",
        resource_type:
          mediaType === "video" ? "video" : mediaType === "audio" ? "raw" : "image",
      });
      mediaUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const story = await Story.create({
      author: user._id,
      authorName: user.fullName,
      avatar: user.avatar,
      mediaUrl,
      mediaType,
      content: content || "",
      likes: 0,
      likesUsers: [],
      comments: [],
      createdAt: new Date(),
    });

    res.json({ story: formatStory(story) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create story" });
  }
});

// ✅ UPDATE story
router.put("/:id", async (req, res) => {
  try {
    const { content } = req.body;
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    story.content = content || story.content;
    await story.save();
    res.json({ story: formatStory(story) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update story" });
  }
});

// ✅ LIKE / UNLIKE story
router.put("/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    if (!story.likesUsers) story.likesUsers = [];

    const likedIndex = story.likesUsers.indexOf(userId);
    if (likedIndex === -1) {
      story.likesUsers.push(userId);
      story.likes++;
    } else {
      story.likesUsers.splice(likedIndex, 1);
      story.likes--;
    }

    await story.save();
    res.json({ story: formatStory(story) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to like/unlike story" });
  }
});

// ✅ ADD comment
router.put("/:id/comment", async (req, res) => {
  try {
    const { userId, comment } = req.body;
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    story.comments.push({ userId, text: comment, createdAt: new Date() });
    await story.save();
    res.json({ story: formatStory(story) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add comment" });
  }
});

export default router;
