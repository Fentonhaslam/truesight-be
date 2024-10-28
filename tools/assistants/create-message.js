import OpenAI from "openai";
const OPENAI_API_KEY = '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';

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

async function createMessage() {
    const message = await openai.beta.threads.messages.create(
        'thread_aORxLXmqQZBJHA9mRrbnSWiA',
        {
            role: "user",
            content: "What is the next questions?"
        }
    );
  
    console.log(message);
  }

async function createMessageWithFile() {
    const message = await openai.beta.threads.messages.create(
        'thread_aORxLXmqQZBJHA9mRrbnSWiA',
        {
            role: "user",
            content: "What do you think of my CV?",
            file_ids: ["file-sxU8bzIyfpfS9T7v8FtO34Zi"]
        },
    );
    console.log(message);
  
  }

//   createMessageWithFile();
    createMessage();