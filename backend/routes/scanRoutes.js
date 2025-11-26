// backend/routes/scanRoutes.js
import express from "express";
import multer from "multer";
import OpenAI from "openai";
import dotenv from "dotenv";
import nutritionDB from "../data/nutritionDB.js";

dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* -------------------------
   🔥 Helper: Fuzzy Matching
------------------------- */
function findClosestMatch(aiName) {
  aiName = aiName.toLowerCase();

  // exact match first
  let exact = nutritionDB.find(
    (item) => item.name.toLowerCase() === aiName
  );
  if (exact) return exact;

  // fuzzy contains match
  let partial = nutritionDB.find(
    (item) => aiName.includes(item.name.toLowerCase()) ||
              item.name.toLowerCase().includes(aiName)
  );
  if (partial) return partial;

  return null;
}

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded (expect form field 'image')"
      });
    }

    const base64 = req.file.buffer.toString("base64");
    const dataUrl = `data:${req.file.mimetype};base64,${base64}`;

    /* -------------------------
       🔥 AI Prompt
    ------------------------- */
    const prompt = `
You identify FOOD from an image. 
Return ONLY raw JSON. No text outside JSON.

Example format:
{
  "name": "Chicken Breast",
  "calories": 0,
  "protein": 0,
  "carbs": 0,
  "fats": 0
}

Ignore accuracy of the numbers. I only need the food NAME.
`;

    /* -------------------------
       🔥 OpenAI Vision Call
    ------------------------- */
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: prompt },
            { type: "input_image", image_url: dataUrl }
          ]
        }
      ],
      temperature: 0.2
    });

    console.log("=== RAW MODEL RESPONSE ===");
    console.log(JSON.stringify(response, null, 2));

    /* -------------------------
       🔥 Extract text from response
    ------------------------- */
    let rawText = "";

    if (response.output_text) {
      rawText = response.output_text;
    } else if (response.output) {
      for (const block of response.output) {
        if (block.content) {
          for (const c of block.content) {
            if (c.text) rawText += c.text;
          }
        }
      }
    }

    rawText = rawText.trim();
    console.log("=== RAW TEXT ===", rawText);

    /* -------------------------
       🔥 Parse JSON
    ------------------------- */
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      }
    }

    if (!parsed || !parsed.name) {
      return res.json({
        success: false,
        message: "AI returned invalid output",
        raw: rawText
      });
    }

    /* -------------------------
       🔥 Use Database to Replace Nutrition
    ------------------------- */
    const aiName = parsed.name.toLowerCase();
    const match = findClosestMatch(aiName);

    let finalFood = {};

    if (match) {
      // use real DB values
      finalFood = {
        name: match.name,
        calories: match.calories,
        protein: match.protein,
        carbs: match.carbs,
        fats: match.fats,
        unit: match.unit
      };
    } else {
      // fallback: use AI values
      finalFood = {
        name: parsed.name,
        calories: Number(parsed.calories) || 0,
        protein: Number(parsed.protein) || 0,
        carbs: Number(parsed.carbs) || 0,
        fats: Number(parsed.fats) || 0
      };
    }

    /* -------------------------
       🔥 Return final cleaned result
    ------------------------- */
    return res.json({
      success: true,
      food: finalFood,
      raw: rawText
    });

  } catch (err) {
    console.error("SCAN ROUTE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: String(err)
    });
  }
});

export default router;



