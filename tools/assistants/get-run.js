
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});



async function getRun() {
    const retrievalRun = await openai.beta.threads.runs.retrieve(
        'thread_7NtwiTHLV7yrMQCOXkzsXQlO',
        'run_Skilp0oBe1gA5BgrGhVBOSAh'
    );
  
    console.log(retrievalRun);
  }

getRun();
