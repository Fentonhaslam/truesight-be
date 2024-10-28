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
	"suggestedCareers": ["Career1", "Career2"]
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

Leeloo: Re-retrieve the CV to obtain the correct email and location information and provide JSON output only`


const OPENAI_API_KEY = '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';

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }  

  async function getFileByName(name) {
    const list = await openai.files.list();
    for await (const file of list) {
        if (file.filename === name) {
            console.log("File:", file);
            return file;
        }
      }
  }
// Function to check for an existing assistant or create a new one if not found
async function getOrCreateAssistant(name, instructions) {
    const assistants = await openai.beta.assistants.list({
      order: "desc",
      limit: 20,
    });
  
    let assistant = assistants.data.find(assistant => assistant.name === name);
    if (!assistant) {
      console.log(`Assistant "${name}" not found. Creating a new one.`);
      assistant = await openai.beta.assistants.create({
        instructions: instructions,
        name: name,
        model: "gpt-4-turbo-preview",
        tools: [{"type": "retrieval"}],
      });
    } else {
      console.log(`Assistant "${name}" found.`);
    }
    return assistant;
  }

  async function createAndUseAssistant() {

    const assistant = await getOrCreateAssistant("CV_Assistant", CVAssistantInstructions);

    console.log("Assistant created:", assistant.name);

    const file = await getFileByName(file);

    console.log("File found:", file);

    const newRun = await createThreadandRun(assistant.id, file.id);
    
  }
