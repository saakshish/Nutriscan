import Food from "../models/Food.js";

// Dummy food database
const foodDB = {
  apple: { protein: 0.3, carbs: 14, fat: 0.2, calories: 52 },
  egg: { protein: 6, carbs: 0.6, fat: 5, calories: 78 },
  rice: { protein: 2.7, carbs: 28, fat: 0.3, calories: 130 },
  chicken: { protein: 27, carbs: 0, fat: 3.6, calories: 165 },
};

// Add food
export const addFood = async (req, res) => {
  const { name, quantity } = req.body;
  const foodData = foodDB[name.toLowerCase()];
  if (!foodData) return res.status(404).json({ message: "Food not found" });

  const factor = quantity / 100;
  const food = await Food.create({
    user: req.user._id,
    name,
    protein: foodData.protein * factor,
    carbs: foodData.carbs * factor,
    fat: foodData.fat * factor,
    calories: foodData.calories * factor,
  });

  res.status(201).json(food);
};

// Get recent foods
export const getFoods = async (req, res) => {
  const foods = await Food.find({ user: req.user._id }).sort({ date: -1 });
  res.json(foods);
};
