import { Context } from 'aws-lambda';
import { AssistantName, createOrUpdateAssistant } from 'utils/assistants';
import { cacheSecretsInEnvironment } from 'utils/lambda-functions';

export const lambdaHandler = async (event: any, context: Context) => {
  // log event
  console.log('Event', event);
  // initialize secrets
  await cacheSecretsInEnvironment();
  // create or update the CV assistant
  await createOrUpdateAssistant(AssistantName.CVAssistant);
  // create or update the Chat assistant
  await createOrUpdateAssistant(AssistantName.ChatAssistant);
  // create or update the User Profile assistant
  await createOrUpdateAssistant(AssistantName.UserProfilerAssistant);
  // create or update the Feedback assistant
  await createOrUpdateAssistant(AssistantName.FeedbackAssistant);
  // return success
  return {
    statusCode: 200
  };
};