import OpenAI from 'openai';

let cachedOpenAIClient: OpenAI;

export const getOpenAIClient = (): OpenAI => {
  if (!cachedOpenAIClient) {
    cachedOpenAIClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return cachedOpenAIClient;
};