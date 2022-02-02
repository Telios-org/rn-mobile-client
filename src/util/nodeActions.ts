import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import nodejs from 'nodejs-mobile-react-native';

import { registerOneTimeListener } from '../eventListenerMiddleware';

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
        registerOneTimeListener(`${eventName}:callback`, event => {
          if (event.error) {
            reject(event.error);
          } else {
            resolve(event.data);
          }
        });
      });
    },
  );
