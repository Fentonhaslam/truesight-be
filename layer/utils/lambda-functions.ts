import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { z } from 'zod';
import { getSupabaseClient } from 'utils/supabase-client';
import { PassThrough, pipeline } from 'stream';
import { promisify } from 'util';

const SECRETS_CACHE_TIMEOUT = 1000 * 60 * 60; // 1 hour

const secretsManagerClient = new SecretsManagerClient({ region: process.env.AWS_REGION });

export const pipelinePromise = promisify(pipeline);

export class LambdaError extends Error {
  statusCode: number;
  data?: object;
  constructor(message: string, statusCode?: number, data?: object) {
    super(message);
    this.statusCode = statusCode || 500;
    if (data) {
      this.data = data;
    }
  }
  static fromUnknown(error: unknown): LambdaError {
    if (error instanceof LambdaError) {
      return error;
    } else if (error instanceof Error) {
      return new LambdaError(error.message, (error as any).statusCode || 500, (error as any).data);
    } else {
      return new LambdaError("Unknown error", 500);
    }
  }
}

export const parsePathParameter = (
  event: APIGatewayProxyEventV2,
  parameterName: string
  ): string => {
  const parameterValue = event.pathParameters?.[parameterName];
  if (!parameterValue) {
      throw new LambdaError(`No ${parameterName} provided`, 400);
  }
  return parameterValue;
};

export function parseBodyFromEvent<T extends z.ZodRawShape>(
  event: APIGatewayProxyEventV2,
  schema: any
): z.infer<z.ZodObject<T>> {
  if (!event.body) {
    throw new LambdaError('No body provided', 400);
  }
  try {
    const eventBody = JSON.parse(event.body);
    return schema.parse(eventBody);
  } catch (error) {
    throw new LambdaError('Invalid body', 400);
  }
}

export async function cacheSecretsInEnvironment() {
  if (!process.env.SECRETS_CACHE_DATE || Date.now() - parseInt(process.env.SECRETS_CACHE_DATE) > SECRETS_CACHE_TIMEOUT) {
    // inject each secret into environment
    const secretsMap: Record<string, string> = JSON.parse(process.env.SECRETS_MAP);
    for (const [key, secretId] of Object.entries(secretsMap)) {
      const { SecretString } = await secretsManagerClient.send(new GetSecretValueCommand({ SecretId: secretId }));
      if (!SecretString) {
        throw new LambdaError(`Secret ${key} not found`);
      }
      process.env[key] = SecretString;
    }
    // set cache date
    process.env.SECRETS_CACHE_DATE = Date.now().toString();
  }
}

export function generateNonStreamingHandler(handler: awslambda.Handler<APIGatewayProxyEventV2, APIGatewayProxyResultV2>): awslambda.Handler<APIGatewayProxyEventV2, APIGatewayProxyResultV2> {
  // cache secrets on cold start
  cacheSecretsInEnvironment();
  // return wrapped handler
  return async (event, context, callback) => {
    // log event
    console.log('Event', event);
    // re-cache secrets (cache expiry)
    await cacheSecretsInEnvironment();
    // standard error handling
    try {
      // run handler
      return await handler(event, context, callback) as APIGatewayProxyResultV2;
    } catch (error) {
      // convert to LambdaError
      let lambdaError = LambdaError.fromUnknown(error);
      // log error
      console.error(lambdaError.message);
      // return error response
      return {
        statusCode: lambdaError.statusCode,
        body: JSON.stringify({ message: lambdaError.message }),
        headers: generateHeaders(),
      } as APIGatewayProxyResultV2;
    }
  };
}

export function generateStreamingHandler(streamHandler: awslambda.StreamifyHandler): awslambda.Handler<any, any> {
  // cache secrets on cold start
  cacheSecretsInEnvironment();
  // return wrapped handler
  return awslambda.streamifyResponse(async (event, responseStream, context) => {
    // log event
    console.log('Event', event);
    // re-cache secrets (cache expiry)
    await cacheSecretsInEnvironment();
    // add streaming headers
    responseStream = awslambda.HttpResponseStream.from(responseStream, {
      headers: generateStreamingHeaders(),
    });
    // standard error handling
    try {
      // run stream handler
      await streamHandler(event, responseStream, context);
    } catch (error) {
      // convert to LambdaError
      let lambdaError = LambdaError.fromUnknown(error);
      // log error
      console.error(lambdaError.message);
      // create passthrough
      const errorStream = new PassThrough();
      // return error response
      errorStream.end(JSON.stringify({ error: lambdaError.message, statusCode: lambdaError.statusCode }));
      // pipeline error stream to response stream
      await pipelinePromise(errorStream, responseStream);
    }
  });
}

export async function validateUserAuth(event: APIGatewayProxyEventV2): Promise<{ userId: string, email: string }> {
  // process JWT token from auth header Bearer
  const token = ('Authorization' in event.headers ? event.headers.Authorization ?? '': event.headers.authorization ?? '').split('Bearer ')[1];
  if (!token) {
    throw new LambdaError('Unauthorized, no token provided', 401);
  }
  const { data: { user } } = await getSupabaseClient().auth.getUser(token);
  if (!user) {
    throw new LambdaError('Unauthorized, could not obtain user from token', 401);
  }
  return { userId: user.id, email: user.email || '' };
}

export async function validateUserAdmin(event: APIGatewayProxyEventV2): Promise<{ userId: string, email: string }> {
  // validate user auth first
  const { userId, email } = await validateUserAuth(event);
  // get admin flag
  const { data, error, status } = await getSupabaseClient()
    .from('User')
    .select('adminFlag')
    .eq('userId', userId)
    .single();
  if (error) {
    throw new LambdaError(error.message, status);
  }
  // throw error if not admin
  if (data.adminFlag !== true) {
    throw new LambdaError("Unauthorized, invalid access", 401);
  }
  return { userId, email };
}

export const generateResponse = (statusCode: number, body: any = null): APIGatewayProxyResultV2 => {
  const response: APIGatewayProxyResultV2 = {
    statusCode,
    headers: generateHeaders(),
  };
  if (body) {
    response.body = JSON.stringify(body);
  }
  return response;
};

export const generateHeaders = (): Record<string, string> => ({
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'no-cache',
});

export const generateStreamingHeaders = (): Record<string, string> => ({
  ...generateHeaders(),
  'Content-Type': 'text/event-stream',
  'Connection': 'keep-alive',
});