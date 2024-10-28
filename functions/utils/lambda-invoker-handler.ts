import { CloudFormationCustomResourceEvent, Context } from 'aws-lambda';
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { send as cfnResponse, SUCCESS, FAILED } from 'cfn-response-async';
import { LambdaError } from 'utils/lambda-functions';

const lambdaClient = new LambdaClient({ region: process.env.AWS_REGION });

export const lambdaHandler = async (event: CloudFormationCustomResourceEvent, context: Context) => {
  // log event
  console.log('Event', event);
  try {
    if (event.RequestType === 'Create' || event.RequestType === 'Update') {
      const command = new InvokeCommand({
        FunctionName: process.env.TARGET_LAMBDA_ARN,
        InvocationType: 'RequestResponse',
      });
      await lambdaClient.send(command);
    }
    await cfnResponse(event, context, SUCCESS, {});
  } catch (error) {
    // convert to LambdaError
    let lambdaError = LambdaError.fromUnknown(error);
    // log error
    console.error(lambdaError.message);
    // return error response
    await cfnResponse(event, context, FAILED, { error: lambdaError.message });
  }
};