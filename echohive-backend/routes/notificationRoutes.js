import express from "express";
const router = express.Router();

// Get all notifications
router.get("/", (req, res) => {
  res.json({ message: "Get all notifications route working!" });
});

// Create a notification
router.post("/", (req, res) => {
  res.json({ message: "Create notification route working!" });
});

export default router;
