// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import coachRoutes from "./routes/coachRoutes.js";
import scanRoutes from "./routes/scanRoutes.js";  // <-- FIXED
import searchRoutes from "./routes/searchRoutes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ---------------------- ROUTES ----------------------
app.use("/api/users", userRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/coach", coachRoutes);
app.use("/api/scan", scanRoutes);  // <-- MUST BE HERE
app.use("/api/search", searchRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.send("NutriSnap backend is running ✅");
});

// ------------------- MONGODB CONNECTION -------------------
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nutrisnap")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ---------------------- START SERVER ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
