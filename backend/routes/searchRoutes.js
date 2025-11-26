import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim() === "") {
      return res.json({ success: false, message: "Empty query" });
    }

    const prompt = `
Return nutrition info ONLY in strict JSON format:

{
  "name": "<food>",
  "calories": <number>,
  "protein": <number>,
  "carbs": <number>,
  "fats": <number>
}

Food: ${query}
`;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      temperature: 0.2
    });

    const text = response.output_text.trim();

    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    }

    if (!parsed) {
      return res.json({ success: false, message: "AI returned invalid format" });
    }

    return res.json({ success: true, food: parsed });

  } catch (err) {
    console.error("SEARCH ROUTE ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;


