import OpenAI from "openai";

const OPENAI_API_KEY = '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';

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

async function main() {
  const myAssistants = await openai.beta.assistants.list({
    order: "desc",
    limit: "20",
  });

  const hasCVAssistant = myAssistants.data.some(assistant => assistant.name === "CV Assistant");
  console.log(hasCVAssistant);
  console.log(myAssistants.data);
  return hasCVAssistant;
}

main();
