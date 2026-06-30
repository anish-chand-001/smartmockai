import axios from "axios";

/**
 * Sends a chat completion request to OpenRouter API.
 * @param {Object|Array} param - Can be an object with a messages array or the array directly.
 * @returns {Promise<string>} The string content response from the AI.
 */
export const askAI = async (param) => {
  const messages = param?.messages || param;

  try {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Invalid input: Messages array is empty or missing.");
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Fixed typo: OpenRouter/OpenAI API structure uses choices[0].message.content (singular)
    const content = response?.data?.choices?.[0]?.message?.content;

    if (!content || !content.trim()) {
      throw new Error("AI provider returned an empty or invalid content response.");
    }

    return content;
  } catch (error) {
    const errorDetails = error.response?.data?.error?.message || error.response?.data || error.message;
    console.error("OpenRouter Service Error:", errorDetails);
    
    // Throw an explicit error carrying the actual root cause context
    throw new Error(`OpenRouter API Failure: ${errorDetails}`);
  }
};