import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/", async (req, res) => {
  console.log("🔥 COACH ROUTE HIT");
  console.log("REQUEST BODY:", req.body);

  try {
    const { message, stats, goals, meals } = req.body;

   const prompt = `
You are Coach Emma, an advanced AI fitness and nutrition assistant.

⚠️ IMPORTANT RULE:
You must NEVER talk about weight, weight history, weight goals, weight change, or ask for weight. You ONLY focus on food, calories, macros, water, steps, meals, and motivation.

Here is today's progress:

🔥 Nutrition
- Calories: ${stats.calories} / ${goals.calories}
- Protein: ${stats.protein}g / ${goals.protein}g
- Carbs: ${stats.carbs}g / ${goals.carbs}g
- Fats: ${stats.fats}g / ${goals.fats}g

💧 Water: ${stats.water} / ${goals.water} glasses
🚶 Steps: ${stats.steps} / ${goals.steps} steps

🍽 Meals Today:
${
  meals && meals.length
    ? meals.map(m => `• ${m.name} — ${m.calories} kcal, P:${m.protein}g`).join("\n")
    : "No meals logged yet today."
}

The user says: "${message}"

First, identify the intent:

- "progress_check" → “How am I doing?”, “Give progress”
- "meal_suggestion" → “What should I eat?”, “Next meal?”
- "motivation" → “I need motivation”, “Help”
- "general_question" → anything else

### If intent = "progress_check":
- Give a clear, short breakdown of calories, macros, water, steps.
- Say what is low/on track/high.
- Recommend 2–3 improvements.
- NEVER mention weight or weight history.

### If intent = "meal_suggestion":
- Do NOT repeat full progress.
- Just talk about remaining calories and macros.
- Give 2 meal options and 2 snack options.
- No weight talk.

### If intent = "motivation":
- Encourage using today’s stats.
- Give 1 simple actionable step.
- No weight talk.

### If intent = "general_question":
- Answer normally.
- No weight talk.

Tone:
- Supportive, clean, modern.
- Light emojis allowed.
`;


    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      temperature: 0.5
    });

    const reply =
      response.output_text ||
      response.choices?.[0]?.message?.content ||
      "I'm here to help!";

    res.json({
      success: true,
      reply
    });

  } catch (err) {
    console.error("Coach Route Error:", err);
    res.status(500).json({
      success: false,
      reply: "I'm having trouble responding right now."
    });
  }
});

export default router;




