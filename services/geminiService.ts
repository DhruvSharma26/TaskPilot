import { Task } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Gemini REST Endpoint
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent
?key=${API_KEY}`;

console.log("API KEY =", import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Get AI advice for a specific task
 */
export const getTaskAdvice = async (task: Task): Promise<string> => {
  try {
    if (!API_KEY) {
      throw new Error(
        "Gemini API Key is missing. Please set VITE_GEMINI_API_KEY.",
      );
    }

    const prompt = `
You are a productivity coach. Give specific, actionable, and encouraging advice for this task:

Title: ${task.title}
Description: ${task.description || "No description provided."}
Priority: ${task.priority}
Due Date: ${task.dueDate}

Format:
- Bullet points
- End with one motivating sentence
Keep it under 150 words.
`;

    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const data = await res.json();

    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't generate advice at this time."
    );
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to get AI advice. Please try again later.");
  }
};

/**
 * Chat with AI assistant
 */
export const chatWithAI = async (
  message: string,
  context: string = "",
): Promise<string> => {
  try {
    if (!API_KEY) {
      throw new Error(
        "Gemini API Key is missing. Please set VITE_GEMINI_API_KEY.",
      );
    }

    const systemInstruction =
      "You are TaskPilot AI, a friendly college productivity assistant. Help the user with scheduling, motivation, and study tips.";

    const prompt = `
System: ${systemInstruction}

Context: ${context}

User: ${message}
`;

    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const data = await res.json();

    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I'm having trouble responding right now."
    );
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("AI connection error.");
  }
};
