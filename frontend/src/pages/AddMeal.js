// frontend/src/pages/AddMeal.js
import React, { useState, useEffect } from "react";
import axios from "axios";

function AddMeal() {
  const [meal, setMeal] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });
  const [meals, setMeals] = useState([]);

  const userId = localStorage.getItem("userId"); // saved at login/signup

  // Handle Input Change
  const handleChange = (e) => {
    setMeal({ ...meal, [e.target.name]: e.target.value });
  };

  // Add Meal
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/meals", { ...meal, userId });
      setMeal({ name: "", calories: "", protein: "", carbs: "", fats: "" });
      fetchMeals();
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Meals
  const fetchMeals = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/meals/${userId}`);
      setMeals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (userId) fetchMeals();
  }, []);

  // Calculate Totals
  const totals = meals.reduce(
    (acc, meal) => {
      acc.calories += meal.calories;
      acc.protein += meal.protein;
      acc.carbs += meal.carbs;
      acc.fats += meal.fats;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Add Meal</h1>

      {/* Meal Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-5 gap-3 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Meal Name"
          value={meal.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="calories"
          placeholder="Calories"
          value={meal.calories}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="protein"
          placeholder="Protein"
          value={meal.protein}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="carbs"
          placeholder="Carbs"
          value={meal.carbs}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="fats"
          placeholder="Fats"
          value={meal.fats}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="col-span-5 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Meal
        </button>
      </form>

      {/* Meals Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Calories</th>
            <th className="border p-2">Protein</th>
            <th className="border p-2">Carbs</th>
            <th className="border p-2">Fats</th>
          </tr>
        </thead>
        <tbody>
          {meals.map((m) => (
            <tr key={m._id}>
              <td className="border p-2">{m.name}</td>
              <td className="border p-2">{m.calories}</td>
              <td className="border p-2">{m.protein}</td>
              <td className="border p-2">{m.carbs}</td>
              <td className="border p-2">{m.fats}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mt-4 font-bold">
        Totals: {totals.calories} kcal | {totals.protein}g Protein | {totals.carbs}g Carbs | {totals.fats}g Fats
      </div>
    </div>
  );
}

export default AddMeal;
