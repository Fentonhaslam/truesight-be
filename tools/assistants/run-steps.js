

import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});



async function runSteps() {
    const runStep = await openai.beta.threads.runs.steps.list(
        'thread_07iwWB5cDT0HyRxzNhqOAgnr',
        'run_9AzZe0whteMWXy2ZYjt4M2Ty'
    );
    console.log(runStep.body.data[0]);
  }

runSteps();

