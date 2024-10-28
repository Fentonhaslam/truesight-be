import { Assistant } from 'openai/resources/beta/assistants';
import { TextContentBlock } from 'openai/resources/beta/threads/messages';
import { getOpenAIClient } from './openai-client';

const ASSISTANT_CACHE_TIMEOUT = 1000 * 60 * 60; // 1 hour

type AssistantCacheEntry = {
  cache_date: Date;
  cached_assistant: Assistant;
};

const assistantCache: Record<string, AssistantCacheEntry> = {};

async function createAssistant() {
  console.log(`Creating Insights Assistant`);
  const assistant = await getOpenAIClient().beta.assistants.create({
    name: `Insights_Assistant`,
    model: "gpt-4o-mini",
    instructions: `You are an insights assistant that processes article headlines and summaries. Generate insights and statistics based on headline content and summary information. Respond with structured JSON output only, without markdown:
    {
      "insights": [
        { "headline": "string", "insight": "string", "related_statistics": ["string", "string"] }
      ]
    }`
  });
  assistantCache["Insights_Assistant"] = { cache_date: new Date(), cached_assistant: assistant };
}

export async function getOrCreateAssistant() {
  if (assistantCache["Insights_Assistant"] && assistantCache["Insights_Assistant"].cache_date > new Date(Date.now() - ASSISTANT_CACHE_TIMEOUT)) {
    return assistantCache["Insights_Assistant"].cached_assistant;
  } else {
    return await createAssistant();
  }
}

export async function sendArticlesAndGetInsights(threadId: string, assistantId: string, articles: { headline: string; summary: string }[], responseStream: NodeJS.WritableStream): Promise<void> {
  const assistantStream = getOpenAIClient().beta.threads.runs.stream(threadId, {
    assistant_id: assistantId,
    additional_messages: articles.map(article => ({
      role: "user",
      content: `Headline: "${article.headline}" Summary: "${article.summary}"`
    }))
  });

  // Stream insights to response
  assistantStream.on("messageDelta", async (message: any) => {
    responseStream.write((message.content[0] as TextContentBlock).text.value);
  });
  assistantStream.on("messageDone", async () => {
    responseStream.end();
  });
}
