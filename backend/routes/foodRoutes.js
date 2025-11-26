import express from "express";

const router = express.Router();

// Simple test route (no auth)
router.get("/all", (req, res) => {
  res.json([
    { name: "Apple", calories: 52, protein: 0.3, carbs: 14, fats: 0.2 },
    { name: "Banana", calories: 96, protein: 1.3, carbs: 27, fats: 0.3 },
  ]);
});

export default router;


