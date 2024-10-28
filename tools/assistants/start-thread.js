import OpenAI from "openai";

const OPENAI_API_KEY = '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';

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

// Function to create a thread and send a message
async function createThreadAndSendMessage(content) {
    try {
        const thread = await openai.beta.threads.create();
        const file = await openai.files.retrieve("file-AzYk46Ry7DvKLAyjwUVL7Jue");
        const message = await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: content,
            file_ids: [file.id]
        });
        console.log("Message sent:", message);
        return thread.id; // Returning thread ID for further use
    } catch (error) {
        console.error("Error creating thread or sending message:", error);
        throw error;
    }
}

// Function to periodically check for new messages in a thread
async function fetchResponsesInThread(threadId) {
    try {
        // Simulate a delay for the assistant's response
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds

        // Hypothetically fetching all messages in the thread
        // Since the actual method to fetch thread messages might vary, adjust according to the OpenAI API documentation
        const messages = await openai.beta.threads.messages.list({ thread_id: threadId });
        
        // Assuming the response structure contains an array of messages
        // Filter or identify the responses from the assistant based on your criteria
        const responses = messages.data.filter(msg => msg.role === 'system' || msg.role === 'assistant');
        
        console.log("Responses received in the thread:", responses);
        return responses;
    } catch (error) {
        console.error(`Error fetching messages from thread ${threadId}:`, error);
        throw error;
    }
}

// Main function to orchestrate the message sending and response fetching
async function main() {
    try {
        const threadId = await createThreadAndSendMessage("Analyse my CV and tell me what you think.");
        console.log("Fetching responses for thread ID:", threadId);
        const responses = await fetchResponsesInThread(threadId);
        console.log("Assistant responses:", responses);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

main();