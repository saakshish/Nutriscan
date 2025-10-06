const express = require("express");
const axios = require("axios");
const router = express.Router();

const USDA_API_KEY = "YOUR_USDA_API_KEY"; // replace with your key

// Route: GET /api/nutrition/:query
router.get("/:query", async (req, res) => {
  try {
    const query = req.params.query;
    const response = await axios.get(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&pageSize=1&api_key=${USDA_API_KEY}`
    );

    if (!response.data.foods || response.data.foods.length === 0) {
      return res.status(404).json({ error: "Food not found" });
    }

    // Pick first food item
    const food = response.data.foods[0];
    const nutrients = food.foodNutrients.map(n => ({
      name: n.nutrientName,
      value: n.value,
      unit: n.unitName
    }));

    res.json({
      name: food.description,
      nutrients: nutrients
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
