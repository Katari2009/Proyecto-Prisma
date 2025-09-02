import { GoogleGenAI } from "@google/genai";

// IMPORTANT: The API key must be set in Vercel's environment variables as VITE_API_KEY.
const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
    console.warn("Google Gemini API key not found (VITE_API_KEY). AI features will be disabled.");
}

// Initialize the GoogleGenAI client if the key is available
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Generates AI-based feedback for a student's answer.
 * @param prompt The prompt to send to the model.
 * @returns The generated text from the model.
 */
export const getAIFeedback = async (prompt: string): Promise<string> => {
    if (!ai) {
        return "El servicio de IA no está disponible en este momento. Asegúrate de que la API Key esté configurada.";
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Eres un profesor chileno de enseñanza media. Proporciona una retroalimentación constructiva y breve (máximo 3 frases) para la siguiente respuesta de un estudiante: "${prompt}"`,
        });

        const text = response.text;
        return text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Hubo un error al generar la retroalimentación. Por favor, inténtalo de nuevo más tarde.";
    }
};