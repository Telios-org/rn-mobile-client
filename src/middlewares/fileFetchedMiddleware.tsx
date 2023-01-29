import { Middleware, MiddlewareAPI } from 'redux';
import { AppDispatch } from '../store';
import { getMessage, saveMailToDB } from '../store/thunks/email';
import { SAVE_MESSAGE_TO_DB_CALLBACK } from '../store/types/events';

type NewMessagePayload = {
  account: any;
  async: boolean;
  meta: any;
};
export const fileFetchedMiddleware: Middleware<{}, {}> =
  (api: MiddlewareAPI<AppDispatch>) => next => action => {
    if (action.type === `node/${SAVE_MESSAGE_TO_DB_CALLBACK}`) {
      api.dispatch(saveMailToDB({ type: 'Incoming', data: action.data }));
    } else if (action.type === 'node/account:newMessage') {
      const data = action.data as NewMessagePayload;
      api.dispatch(getMessage(data));
    }
    return next(action);
  };
