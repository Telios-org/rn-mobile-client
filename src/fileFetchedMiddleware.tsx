import { Middleware, MiddlewareAPI } from 'redux';
import { AppDispatch } from './store';
import { Email, getMessage, mailSlice, saveMailToDB } from './store/mail';

export type FileFetchedPayload = {
  _id: string;
  email: Email;
};

type NewMessagePayload = {
  account: any;
  async: boolean;
  meta: any;
};

export const fileFetchedMiddleware: Middleware<{}, {}> =
  (api: MiddlewareAPI<AppDispatch>) => next => action => {
    if (action.type === 'node/messageHandler:fileFetched') {
      const data = action.data as FileFetchedPayload;
      api.dispatch(mailSlice.actions.fileFetched(data));
      // api.dispatch(
      //   saveMailToDB({ messageType: 'Incoming', messages: [email] }),
      // );
    } else if (action.type === 'node/account:newMessage') {
      const data = action.data as NewMessagePayload;
      // api.dispatch(getMessage(data));
    }

    return next(action);
  };
