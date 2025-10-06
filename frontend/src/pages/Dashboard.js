// src/pages/Dashboard.jsx
import React, { useState } from "react";

const Dashboard = () => {
  const [foodName, setFoodName] = useState("");
  const [foodLog, setFoodLog] = useState([
    {
      name: "Grilled Chicken Breast",
      calories: 231,
      protein: 43,
      carbs: 4,
      image:
        "https://images.unsplash.com/photo-1604908177520-7e68a2642b1e?auto=format&fit=crop&w=80&q=80",
    },
  ]);
  const [image, setImage] = useState(null);

  const handleAddFood = () => {
    if (!foodName || !image) return;

    const newFood = {
      name: foodName,
      calories: Math.floor(Math.random() * 500), // placeholder for calories
      protein: Math.floor(Math.random() * 50), // placeholder for protein
      carbs: Math.floor(Math.random() * 50), // placeholder for carbs
      image: URL.createObjectURL(image),
    };

    setFoodLog([newFood, ...foodLog]);
    setFoodName("");
    setImage(null);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-lg mb-6">
        ✅ Welcome Alex
        <br />
        Add food and track your nutrition
      </p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add Food</h2>
        <input
          type="text"
          placeholder="Food Name"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full mb-2"
        />
        <button
          onClick={handleAddFood}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Add Food
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Food Log</h2>
        {foodLog.map((food, index) => (
          <div key={index} className="flex items-center mb-4">
            <img
              src={food.image}
              alt={food.name}
              className="w-20 h-20 object-cover rounded mr-4"
            />
            <div>
              <p className="font-bold">{food.name}</p>
              <p>Calories: {food.calories} kcal</p>
              <p>Protein: {food.protein}g</p>
              <p>Carbs: {food.carbs}g</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
