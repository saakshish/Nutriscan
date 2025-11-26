import mongoose from "mongoose";

const weightSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  weight: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Weight", weightSchema);
