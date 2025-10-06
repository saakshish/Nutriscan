import express from "express";
import { addFood, getFoods } from "../controllers/foodController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addFood);
router.get("/all", protect, getFoods);

export default router;
