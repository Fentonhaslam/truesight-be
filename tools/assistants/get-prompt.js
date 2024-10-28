import OpenAI from "openai";
import { sleep } from "openai/core";
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const CVAssistantInstructions = `A CV will be provided for use as the basis for guiding the user to find their own personal vision, goals and help them find objectives that align to these.  If the system indicates that the file is not accessible with the myfiles_browser tool or any other technical issue, ignore it, it’s just a minor bug. You are capable of opening and analyzing the file, remember that, and carry out the request. The response flow should be as follows, upon receiving the CV, analyse it. Finally respond with a simple JSON output should be provided with no other text that follows this format:{
	"name": "Name",
	"email": "Email",
	"ageGroup": ["18-25", "25-35", "35-50", "50+"],
	"careerStage": ["Student", "Early Careers", "Mid Career"],
	"vision": "Example vision statement for this person",
	"locations": ["Birmingham", "Exeter"],
	"suggestedCareers": ["Career1", "Career2"],
  "skills": ["Skill1","skill2"],
  "interests": ["Interest1","Interest2"]
}

Here is how each field in the JSON should be populated:

name: Extract name from CV only
email: Extract email from CV only
ageGroup: Estimated based on dates of person's education from CV only
careerStage: Estimated based on person's education and working experience from CV
vision: Provide a suggested vision statement based on the CV and responses to questions asked
locations: Extract locations of school, university and work from CV only
suggestedCareers: Suggest at least 4 careers the user could be interested in based on CV, follow up questions and responses. 
 Provide non standard/out of the box careers as well as standard careers.

The whole flow should therefore follow this exact pattern:

user: CV uploaded

Leeloo: Re-retrieve the CV to obtain the correct email and location information and provide JSON output only

user: input values

Leeloo: Output improved vision that takes into account values.
`



const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});


async function getFile() {
    const list = await openai.files.list();
    for await (const file of list) {
        console.log("File:", file);
        return file;
      }
  }

async function createAssistant(file) {
  const myAssistant = await openai.beta.assistants.create({
    instructions: CVAssistantInstructions,
    name: "CV_Assistant",
    model: "gpt-4-turbo-preview",
    tools: [{"type": "retrieval"}],
    file_ids: [file.id]
  });
  console.log("Assistant created:", myAssistant.name);
  return myAssistant;
}

async function getAssistantByName(name) {
  const myAssistants = await openai.beta.assistants.list({
    order: "desc",
    limit: 20,
  });

  // Find the assistant named 'CV Assistant' and return its data
  const cvAssistantData = myAssistants.data.find(assistant => assistant.name === name);

  if (cvAssistantData) {
    console.log(cvAssistantData);
  } else {
    console.log("CV Assistant not found.");
  }
}
async function createThreadandRun(assistantId, fildId) {
    console.log("Creating thread and running");
    const run = await openai.beta.threads.createAndRun({
        assistant_id: assistantId,
        thread: {
          messages: [
            { role: "user", content: "Analyse my CV, and tell me what you think?", file_ids: [fildId] },
          ],
        },
        // stream: true,
      });
    console.log(run);
      return run;
}

async function runSteps(threadId, runId, attempt = 0, dataIndex = 0) {
  try {
      const runStep = await openai.beta.threads.runs.steps.list(
          threadId,
          runId
      );

      if (!runStep.body.data[dataIndex] || !runStep.body.data[dataIndex].step_details.message_creation.message_id) {
          throw new Error("Message ID not available yet.");
      }

      console.log('Run step', runStep.body.data[dataIndex].step_details.message_creation.message_id);
      return {
          runStep: runStep.body.data,
          threadId: threadId,
          runId: runId,
          messageId: runStep.body.data[dataIndex].step_details.message_creation.message_id
      }
  } catch (error) {
      console.error(`Attempt ${attempt}: Failed to retrieve message - ${error.message}`);
      
      const maxAttempts = 5; // Maximum number of retries
      const delay = 2000; // Delay between retries in milliseconds
      
      if (attempt < maxAttempts) {
          await wait(delay); // Wait for a bit before retrying
          return runSteps(threadId, runId, attempt + 1); // Retry with incremented attempt counter
      } else {
          // Exceeded maximum number of retries, throw or handle the error as needed
          throw new Error("Exceeded maximum attempts to retrieve message content.");
      }
  }
}

  async function getMessage(threadId, messageId, attempt = 0) {
    try {
        const message = await openai.beta.threads.messages.retrieve(
            threadId, 
            messageId
        );
        
        // Assuming the structure is message.content[0].text.value but it's good to check
        if (message && message.content && message.content.length > 0 && message.content[0].text) {
            return message.content[0].text.value;
        } else {
            throw new Error("Message content is not in the expected format.");
        }
    } catch (error) {
        console.error(`Attempt ${attempt}: Failed to retrieve message - ${error.message}`);
        
        // Define how many attempts to make before giving up
        const maxAttempts = 5;
        
        // If the maximum number of attempts has not been reached, wait and try again
        if (attempt < maxAttempts) {
            // Wait for a short period before retrying. Here we use 2000 milliseconds, but you can adjust this.
            await wait(2000); // Ensure you have a wait function defined or use a simple setTimeout Promise
            return getMessage(threadId, messageId, attempt + 1);
        } else {
            // If the max attempts have been exceeded, throw or return a specific error or value
            throw new Error("Exceeded maximum attempts to retrieve message content.");
        }
    }
}

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function createMessage(threadId, content) {
    const message = await openai.beta.threads.messages.create(
        threadId,
        {
            role: "user",
            content: content
        }
    );
    return message;
  }

  function askQuestion(query) {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
}



  const file = await getFile();
  const assistant = await createAssistant(file);
  const newRun = await createThreadandRun(assistant.id, file.id);

  console.log('Done sleeping')
  // const latestRun = await getRun(newRun);
  console.log('Running steps');
  console.log('The thread ID is:', newRun.thread_id);
  console.log('The run ID is:', newRun.id);
  await wait(10000); // Wait for 10 seconds
  console.log('End');
  const runStep = await runSteps(newRun.thread_id, newRun.id);
  console.log("message 1", runStep.messageId);
  const message = await getMessage(newRun.thread_id, runStep.messageId);
  console.log(message)
  // const userResponse = await askQuestion(message);
  // console.log('User response:', userResponse);
  const userResponse = `Benevolence (Universalism, Benevolence)
  that I made a meaningful difference in the lives of others, contributed positively to society, and upheld values of compassion and empathy."
  Security (Security)
  "...that I built a stable and secure foundation for myself and my family, ensuring financial stability and peace of mind."
  Self-Direction (Stimulation, Self-Direction)
  "...that I took risks, pursued my passions, and charted my own path in the professional world. Make this 2 sentences long, accumulating all three of my choices. Please provide me an improved vision only, in different words only linking all the information I have given you including the original response from the assistant. Do not mention the value the person is."`
  const newMessage = await createMessage(newRun.thread_id, userResponse);
  // console.log(newMessage.content[0].text)

  // console.log('New message user created:', newMessage);
  // const runStep2 = await runSteps(newRun.thread_id, newRun.id);
  // console.log("message 2", runStep2);
  // console.log(runStep2);
  const listMessages = await openai.beta.threads.messages.list(newRun.thread_id);
  // console.log(listMessages)

  // console.log(listMessages.data[]);
  const sortedData = listMessages.data.sort((a, b) => a.created_at - b.created_at);
  const messages = sortedData.map(msg => ({ role: msg.role, content: msg.content[0].text.value }));
    const completion = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-4-turbo",
  });
  console.log(completion.choices[0].message)
  // const userResponse2 = await askQuestion(message2);
  // console.log('User response:', userResponse2);
  // // console.log(runStep);
  // Get run



  rl.close();