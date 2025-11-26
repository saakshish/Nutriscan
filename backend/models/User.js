import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Optional: extra health tracking fields
  dailyCalorieGoal: { type: Number, default: 2000 },
  todayCalories: { type: Number, default: 0 },
  steps: { type: Number, default: 0 },
  coachName: { type: String, default: "Emma" }
});

const User = mongoose.model("User", userSchema);
export default User;
