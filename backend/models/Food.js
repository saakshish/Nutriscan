import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  protein: Number,
  carbs: Number,
  fat: Number,
  calories: Number,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Food", foodSchema);
