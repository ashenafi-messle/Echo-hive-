import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  authorName: { type: String, required: true },
  avatar: { type: String },
  content: { type: String },
  mediaUrl: { type: String },
  mediaType: { type: String, enum: ["image", "video", "audio"] },
  time: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
