import OpenAI from "openai";

const OPENAI_API_KEY = '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';

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

async function main() {
  const emptyThread = await openai.beta.threads.create();

  console.log(emptyThread);
}

main();
