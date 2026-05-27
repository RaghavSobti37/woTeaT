const { GoogleGenAI } = require('@google/genai');

// Use dummy API key for testing if real one is not available
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });

async function generateTasteVector(name, description) {
  // If we don't have a real API key, simulate the LLM call for testing purposes
  if (!process.env.GEMINI_API_KEY) {
    return [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
  }

  try {
    const prompt = `Analyze this dish and return a JSON array of 5 floats between 0 and 1 representing [Spice, Cream, Fry, Tang, Carb].
    Dish: ${name}
    Description: ${description || 'N/A'}
    Output ONLY a JSON array like [0.6, 0.8, 0.2, 0.4, 0.5]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const text = response.text;
    const match = text.match(/\[(.*?)\]/);
    if (match) {
      return JSON.parse(`[${match[1]}]`);
    }
  } catch (err) {
    console.error('LLM Tagging Failed:', err);
  }
  // Fallback graceful degradation vector
  return [0.5, 0.5, 0.5, 0.5, 0.5];
}

module.exports = {
  generateTasteVector
};
