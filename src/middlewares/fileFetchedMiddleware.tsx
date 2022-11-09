import { Middleware, MiddlewareAPI } from 'redux';
import { AppDispatch } from '../store';
import { getMessage, saveMailToDB } from '../store/thunks/email';
import { EmailContent } from '../store/types';

type Email = {
  content: EmailContent;
  header: string;
  key: string;
  savedToDB?: boolean;
  markedAsSynced?: boolean;
  _id?: string;
};

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

      const email = transformEmail(data);
      // api.dispatch(mailSlice.actions.fileFetched(email));
      api.dispatch(saveMailToDB({ type: 'Incoming', messages: [email] }));
    } else if (action.type === 'node/account:newMessage') {
      const data = action.data as NewMessagePayload;
      api.dispatch(getMessage(data));
    }
    return next(action);
  };

function transformEmail(data: any) {
  const email = data?.email?.content;

  return {
    ...email,
    _id: data._id,
    bodyAsText: email?.text_body,
    bodyAsHTML: email?.html_body,
  };
}
