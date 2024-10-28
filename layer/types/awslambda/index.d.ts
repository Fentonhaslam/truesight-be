import { APIGatewayProxyEventV2, Callback, Context, Handler } from "aws-lambda";
import { Writable } from 'stream';

declare global {
  namespace awslambda {
    export namespace HttpResponseStream {
      function from(writable: Writable, metadata: any): Writable;
    }

    export type Handler<TEvent = any, TResult = any> = (event: TEvent, context: Context, callback: Callback<TResult>) => void | Promise<TResult>
    
    export type StreamifyHandler = (event: APIGatewayProxyEventV2, responseStream: Writable, context: Context) => Promise<any>;

    export function streamifyResponse(handler: StreamifyHandler) : Handler<any, any>;
  }
}