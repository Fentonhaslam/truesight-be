

import OpenAI from "openai";
const OPENAI_API_KEY = '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';

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});


async function listMessages() {
    const messages = await openai.beta.threads.messages.list(
        'thread_aORxLXmqQZBJHA9mRrbnSWiA'
    );
    console.log(messages);
}

listMessages();