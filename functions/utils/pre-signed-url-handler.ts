import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { S3Client, S3ClientConfig, PutObjectCommand } from '@aws-sdk/client-s3';
import { generateNonStreamingHandler, generateResponse, LambdaError } from 'utils/lambda-functions'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Configuration: S3ClientConfig = { region: process.env.AWS_REGION };
const s3 = new S3Client(s3Configuration);
const URL_EXPIRY_SECONDS = 300;

const getFileIdFromEvent = (event: APIGatewayProxyEventV2) => {
  const fileId = event.pathParameters?.fileId;
  if (!fileId) {
    throw new LambdaError('No fileId provided', 400);
  }
  return fileId;
};

export const lambdaHandler = generateNonStreamingHandler(async (event): Promise<APIGatewayProxyResultV2> => {
  // get file id from event
  const fileId = getFileIdFromEvent(event);
  const bucketName = process.env.UPLOAD_BUCKET;
  // ensure filename uploaded is unique
  const objectKey = event.requestContext.requestId + '/' + fileId;
  const command = new PutObjectCommand({ Bucket: bucketName, Key: objectKey, ContentType: 'application/octet-stream' });
  console.log('command', command)
  // generate signed url
  const url = await getSignedUrl(s3, command, { expiresIn: URL_EXPIRY_SECONDS });
  // return response
  return generateResponse(200, { url, objectKey });
});