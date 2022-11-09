import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import nodejs from 'nodejs-mobile-react-native';

import { registerOneTimeListener } from '../middlewares/eventListenerMiddleware';

/*
  createNodeCalloutAsyncThunk

  This is a helper function to send an action to Node and wait for an async response. 
  A common pattern when using telios-client-backend (https://github.com/Telios-org/telios-client-backend) within Node 
  is to communicate using named events. We send an event eg `email:saveMessageToDB` and wait for response `email:saveMessageToDB:callback`. 

  In order to keep track of request/response and convert into round trip calls on the React Native side,
  this helper function will send an event, register a one time listener for the :callback event, and resolve the promise
  after it is received. 

  Note: this function works well when we do not expect multiple events of the same type to occur concurrently.
  In cases where there may be multiple events coming from Node which we can't distinguish from the request,
  avoid this function and instead use `registerOneTimeListener` with a custom predicate. (see saveMailToDB as an example). 

  This could be improved drastically in the future if we could supply a unique ID with each request 
  that is mirrored on the response. But that functionality is not built into telios-client-backend currently. 

*/
export const createNodeCalloutAsyncThunk = <RequestPayload, ResponseType>(
  eventName: string,
): AsyncThunk<ResponseType, RequestPayload, {}> =>
  createAsyncThunk(
    `local/${eventName}`,
    async (data: RequestPayload): Promise<ResponseType> => {
      return new Promise((resolve, reject) => {
        nodejs.channel.send({
          event: eventName,
          payload: data,
        });
        registerOneTimeListener(
          { eventName: `node/${eventName}:callback` },
          event => {
            if (event.error) {
              reject(event.error);
            } else {
              resolve(event.data);
            }
          },
        );
      });
    },
  );
