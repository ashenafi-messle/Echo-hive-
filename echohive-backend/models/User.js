import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, unique: true, sparse: true }, // optional, unique if provided
  email:    { type: String, required: true, unique: true }, // unique email
  password: { type: String, required: true },
  bio:      { type: String, default: "" },
  avatar:   { type: String, default: "" }, // profile picture
  details:  { type: String, default: "" }, // course, year, location, etc.
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  requests:  [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

export default mongoose.model("User", userSchema);

