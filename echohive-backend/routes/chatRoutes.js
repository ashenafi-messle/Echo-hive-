import express from "express";
const router = express.Router();

// Example route
router.get("/", (req, res) => {
  res.send("Chat route working!");
});

export default router;  // ✅ This is the fix
