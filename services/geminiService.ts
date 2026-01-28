
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client using the environment variable strictly as required.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a short, powerful sermon title and key points from a scripture.
 */
export async function generateSermonSummary(scripture: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional sermon research assistant. Generate a powerful sermon title and 3 key theological points for the following scripture: ${scripture}. Keep it concise for a broadcast lower-third.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Theological insight unavailable.";
  }
}

/**
 * Generates specific prayer points based on a scripture verse for live church intercession.
 */
export async function generatePrayerPoints(scripture: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on this scripture: "${scripture}", generate 3 short, impactful prayer points for a live church service intercession segment. Format as a clean list.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Prayer Error:", error);
    return "Intercession points unavailable.";
  }
}
