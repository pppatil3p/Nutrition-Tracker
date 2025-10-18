import dotenv from 'dotenv';
dotenv.config();

import MealLog from '../models/MealLog.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// --- Helper to call Gemini ---
async function getAIAnalysis(meals) {
  const systemInstruction = `
You are a nutrition assistant. Your ONLY allowed output is JSON in this format:
{
  "perItemBreakdown": [
    { "food": "string", "quantity": "string", "estimatedCalories": number, "protein": number, "carbs": number, "fats": number }
  ],
  "totals": { "calories": number, "protein": number, "carbs": number, "fats": number },
  "suggestions": ["string"],
  "motivation": "string",
  "workoutPlan": {
    "monday": ["string"],
    "tuesday": ["string"],
    "wednesday": ["string"],
    "thursday": ["string"],
    "friday": ["string"],
    "saturday": ["string"]
  }
}
Return ONLY this JSON with no explanation or markdown.
`;

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction,
  });

  const chat = model.startChat({
    generationConfig: {
      temperature: 0.4,
      topP: 0.9,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
    },
    history: [],
  });

  const prompt = `Strictly analyze this meal log and return only the JSON. Meal log:\n${JSON.stringify(meals)}`;
  const result = await chat.sendMessage(prompt);

  let aiResponse;
  try {
    aiResponse = JSON.parse(result.response.text());
  } catch (e) {
    console.error('Invalid AI JSON:', result.response.text());
    throw new Error('AI returned invalid JSON.');
  }

  // Fill missing fields
  aiResponse = {
    perItemBreakdown: Array.isArray(aiResponse.perItemBreakdown) ? aiResponse.perItemBreakdown : [],
    totals: {
      calories: aiResponse.totals?.calories ?? 0,
      protein: aiResponse.totals?.protein ?? 0,
      carbs: aiResponse.totals?.carbs ?? 0,
      fats: aiResponse.totals?.fats ?? 0,
    },
    suggestions: Array.isArray(aiResponse.suggestions) ? aiResponse.suggestions : [],
    motivation: aiResponse.motivation ?? "",
    workoutPlan: {
      monday: aiResponse.workoutPlan?.monday ?? [],
      tuesday: aiResponse.workoutPlan?.tuesday ?? [],
      wednesday: aiResponse.workoutPlan?.wednesday ?? [],
      thursday: aiResponse.workoutPlan?.thursday ?? [],
      friday: aiResponse.workoutPlan?.friday ?? [],
      saturday: aiResponse.workoutPlan?.saturday ?? [],
    }
  };

  return aiResponse;
}

// --- CREATE NEW ---
export const analyzeAndSaveMeals = async (req, res) => {
  try {
    const { meals } = req.body;
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Not authorized' });
    if (!meals) return res.status(400).json({ message: 'No meals provided' });

    const count = await MealLog.countDocuments({ userId });
    const day = count + 1;

    const aiResponse = await getAIAnalysis(meals);

    const newLog = await MealLog.create({
      userId,
      day,
      meals,
      aiResponse,
      calories: aiResponse.totals.calories,
      protein: aiResponse.totals.protein,
      carbs: aiResponse.totals.carbs,
      fat: aiResponse.totals.fats,
    });

    res.json({ success: true, data: newLog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// --- GET ALL LOGS FOR USER ---
export const getAllMealLogs = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const logs = await MealLog.find({ userId }).sort({ day: 1 });
    res.json({ success: true, data: logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// --- EDIT EXISTING LOG (Re-analyze) ---
export const editMealLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { meals } = req.body;
    if (!meals) return res.status(400).json({ message: 'No meals provided' });

    const aiResponse = await getAIAnalysis(meals);

    const updated = await MealLog.findByIdAndUpdate(
      id,
      {
        meals,
        aiResponse,
        calories: aiResponse.totals.calories,
        protein: aiResponse.totals.protein,
        carbs: aiResponse.totals.carbs,
        fat: aiResponse.totals.fats,
      },
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// --- DELETE LOG ---
export const deleteMealLog = async (req, res) => {
  try {
    const { id } = req.params;
    await MealLog.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};
