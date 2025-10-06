// backend/routes/mealRoutes.js
const express = require("express");
const Meal = require("../models/Meal");
const router = express.Router();

// Add Meal
router.post("/", async (req, res) => {
  try {
    const { userId, name, calories, protein, carbs, fats } = req.body;
    const meal = new Meal({ user: userId, name, calories, protein, carbs, fats });
    await meal.save();
    res.status(201).json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Meals for a User
router.get("/:userId", async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
