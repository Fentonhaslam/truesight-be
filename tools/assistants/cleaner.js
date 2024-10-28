import OpenAI from "openai";

const OPENAI_API_KEY = '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';

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });


  async function listAssistants() {
    const myAssistants = await openai.beta.assistants.list({
      order: "desc",
      limit: 20,
    });
    return myAssistants.data;
  }

  async function listFiles(){
    const list = await openai.files.list();
    return list.data
  }

async function deleteAssistants() {
    try {
      const assistants = await listAssistants();
      console.log("Deleting assistants...")
      console.log(assistants);
      for (const assistant of assistants) {
        console.log(`Deleting assistant ${assistant.id}...`);
        await openai.beta.assistants.del(assistant.id);
        console.log(`Deleted assistant ${assistant.id}`);
      }
      console.log("All assistants have been deleted.");
      } catch (error) {
      console.error(`Error deleting assistants: ${error}`);
    }
}

async function deleteFiles(){
  try {
    const files = await listFiles();
    console.log('deleting files')
    console.log(files)

    for (const file of files) {
      console.log(`Deleting file ${file.id}...`);
      await openai.files.del(file.id);
      console.log(`Deleted file`);
    }
    console.log('All files are deleted');
  }
  catch (error) {
    console.error(`Error deleting files: ${error}`);
  }
}


deleteAssistants();
deleteFiles();