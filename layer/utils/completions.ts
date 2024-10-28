import { getOpenAIClient } from './openai-client';

const COMPLETION_MODEL = "gpt-4o-mini";
const MAX_TOKENS = 2048;
const TEMPERATURE = 1;
const TOP_P = 1;
const FREQUENCY_PENALTY = 0;
const PRESENCE_PENALTY = 0;

/**
 * Builds the system prompt to instruct the assistant to extend the user's current interests and skills.
 * @param {string} userInterestsAndSkills - The current JSON of the user's interests and skills to be included in the system prompt.
 * @returns {object} - System message object for the assistant.
 */

function buildUserProfileSystemPrompt(userInterestsAndSkills: string) {
  return {
    role: "system",
    content: [
      {
        type: "text",
        text: `Respond in JSON extending the user's current interests and skills based on what has been said in the chat, current json:\n\n${userInterestsAndSkills}`
      }
    ]
  };
}

/**
 * Generates a completion that extends the user's profile (interests and skills) based on provided messages.
 * @param {string} userInterestsAndSkills - JSON of the user's interests and skills.
 * @param {any[]} additionalMessages - Additional user/assistant messages that should be passed into the conversation.
 * @returns {Promise<any>} - The OpenAI completion response.
 */

export async function generateExtendedUserProfileCompletion(userInterestsAndSkills: string, additionalMessages: any[]) {
  console.log("Generating extended user profile completion");

  // Initialize OpenAI client
  const openai = getOpenAIClient();

  // Build the system message using the user profile information
  const systemMessage = buildUserProfileSystemPrompt(userInterestsAndSkills);

  // Combine the system message with additional user/assistant messages
  const messages = [systemMessage, ...additionalMessages];

  // Perform chat completion
  const response = await openai.chat.completions.create({
    model: COMPLETION_MODEL,
    messages: messages,
    temperature: TEMPERATURE,
    max_tokens: MAX_TOKENS,
    top_p: TOP_P,
    frequency_penalty: FREQUENCY_PENALTY,
    presence_penalty: PRESENCE_PENALTY,
    response_format: {
      "type": "json_object"
    },
  });

  // Return the response
  return response;
}
