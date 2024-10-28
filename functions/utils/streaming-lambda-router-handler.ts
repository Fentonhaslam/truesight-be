import { generateStreamingHandler, pipelinePromise, LambdaError } from 'utils/lambda-functions';

const streamingLambdaURLs = JSON.parse(process.env.STREAMING_LAMBDA_URLS);

export const lambdaHandler = generateStreamingHandler(async (event, responseStream) => {
  // get route from event path
  const route = event.rawPath.substring(1);
  // check if route exists
  if (!streamingLambdaURLs[route]) {
    throw new LambdaError("Route not found: " + route, 404);
  }
  // convert headers
  const headers: HeadersInit = {};
  for (const key in event.headers) {
    if (event.headers.hasOwnProperty(key)) {
      headers[key] = event.headers[key]!;
    }
  }
  // fetch response from downstream streaming lambda
  const fetchResponse = await fetch(streamingLambdaURLs[route], {
    method: event.requestContext.http.method,
    headers: headers,
    body: event.body,
  });
  // pipeline fetch response stream to response stream
  await pipelinePromise(fetchResponse.body as ReadableStream, responseStream);
});