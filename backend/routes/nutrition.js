// backend/routes/nutrition.js
import axios from "axios";

const USDA_API_KEY = "YOUR_USDA_API_KEY"; // replace with your real key

export async function getNutrition(query) {
  try {
    const response = await axios.get(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&pageSize=1&api_key=${USDA_API_KEY}`
    );

    if (!response.data.foods || response.data.foods.length === 0) {
      return null;
    }

    const food = response.data.foods[0];

    const nutrients = {};

    food.foodNutrients.forEach(n => {
      if (n.nutrientName.includes("Energy") && n.unitName === "KCAL")
        nutrients.calories = n.value;

      if (n.nutrientName === "Protein")
        nutrients.protein = n.value;

      if (n.nutrientName.includes("Carbohydrate"))
        nutrients.carbs = n.value;

      if (n.nutrientName.includes("Total lipid"))
        nutrients.fats = n.value;
    });

    return {
      name: food.description,
      calories: nutrients.calories || 0,
      protein: nutrients.protein || 0,
      carbs: nutrients.carbs || 0,
      fats: nutrients.fats || 0
    };

  } catch (err) {
    console.error("USDA API ERROR:", err);
    return null;
  }
}

export default { getNutrition };


