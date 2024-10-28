import OpenAI from "openai";
const OPENAI_API_KEY = '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';

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

async function getMessage() {
    const message = await openai.beta.threads.messages.retrieve(
        'thread_aORxLXmqQZBJHA9mRrbnSWiA',
        'msg_9Deg73H3RGZHAbk0OOO61Ddm'
    );
  
    console.log(message.content[0].text.value);
  }

getMessage();