
import { GoogleGenAI } from "@google/genai";

// Initialize GoogleGenAI with the required configuration.
// Always use the named parameter apiKey and assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartGreeting = async (timeOfDay: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a super cute, short, and motivational morning greeting for a user. The time is currently ${timeOfDay}. Use emojis, be very friendly and "kawaii". Keep it under 2 sentences. Include a tiny bit of encouragement. Translate to Korean.`,
    });
    // Use .text property directly as per Gemini API guidelines.
    return response.text || "오늘도 행복한 하루 보내세요! ✨";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "좋은 하루 되세요! 🌸";
  }
};

export const getAlarmMotivation = async (label: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user's alarm for "${label}" is ringing. Write a very cute, energetic, and slightly funny wake-up message in Korean. Make it feel like a supportive best friend. Max 15 words.`,
    });
    // Use .text property directly as per Gemini API guidelines.
    return response.text || "일어날 시간이에요! 화이팅! ☀️";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "좋은 아침이에요! 어서 일어나세요! ✨";
  }
};
