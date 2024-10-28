import OpenAI from "openai";
const OPENAI_API_KEY = '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';

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

//   getFile();

  async function getFileByName(name) {
    const list = await openai.files.list();
    for await (const file of list) {
        if (file.filename === name) {
            console.log("File:", file);
            return file;
        }
      }
  }
getFileByName("Marcus James van Abbe CV 2024.pdf");