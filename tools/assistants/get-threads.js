
import OpenAI from "openai";

const OPENAI_API_KEY = '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';

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });


async function main() {
    const myThread = await openai.beta.threads.retrieve(
      'thread_aORxLXmqQZBJHA9mRrbnSWiA'
    );
  
    console.log(myThread);
  }
  
  main();