import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  authorName: String,
  avatar: String,
  mediaUrl: String,
  mediaType: String,
  content: { type: String, default: "" }, // optional text content
  likes: { type: Number, default: 0 }, // total likes
  likesUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // users who liked
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      userName: String,
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }, // optional: for disappearing stories
});

export default mongoose.model("Story", storySchema);

