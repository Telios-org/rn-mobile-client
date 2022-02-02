import { Middleware, MiddlewareAPI } from 'redux';
import { Email, mainSlice, saveMailToDB } from './mainSlice';
import { AppDispatch } from './store';

export const fileFetchedMiddleware: Middleware<{}, {}> =
  (api: MiddlewareAPI<AppDispatch>) => next => action => {
    console.log('file fetched middleware attached', action.type);
    if (action.type === 'messageHandler:fileFetched') {
      console.log('caught fileFetched event', action);
      const email = {
        ...action.data.email,
        _id: action.data._id,
      } as Email;
      api.dispatch(
        saveMailToDB({ messageType: 'Incoming', messages: [email] }),
      );
    }

    return next(action);
  };
