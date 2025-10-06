import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
// import mealRoutes from "./routes/mealRoutes.js"; // uncomment if using meals

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
// app.use("/api/meals", mealRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/nutriscan")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
