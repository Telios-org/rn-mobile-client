import { Middleware } from 'redux';

const oneTimeListeners: { [eventName: string]: Array<(action: any) => void> } =
  {};

export const registerOneTimeListener = (
  eventName: string,
  callback: (action: any) => void,
) => {
  if (oneTimeListeners[eventName]) {
    oneTimeListeners[eventName].push(callback);
  } else {
    oneTimeListeners[eventName] = [callback];
  }
};

export const removeListeners = (eventName: string) => {
  if (oneTimeListeners[eventName]) {
    delete oneTimeListeners[eventName];
  }
};

export const eventListenerMiddleware: Middleware<{}, {}> =
  () => next => action => {
    console.log('event listener middleware. action', action);
    if (oneTimeListeners[action.type]) {
      for (const callback of oneTimeListeners[action.type]) {
        callback(action);
      }
      delete oneTimeListeners[action.type];
    }
    return next(action);
  };
