import { Middleware } from 'redux';

type ActionCallback = (action: any) => void;
type CustomPredicate = (action: any) => boolean;

const oneTimeListeners: {
  [eventName: string]: Array<{
    callback: ActionCallback;
    customPredicate?: CustomPredicate;
  }>;
} = {};

export const registerOneTimeListener = (
  args: { eventName: string; customPredicate?: CustomPredicate },
  callback: (action: any) => void,
) => {
  if (oneTimeListeners[args.eventName]) {
    oneTimeListeners[args.eventName].push({
      callback,
      customPredicate: args.customPredicate,
    });
  } else {
    oneTimeListeners[args.eventName] = [
      { callback, customPredicate: args.customPredicate },
    ];
  }
};

export const removeAllListenersForEvent = (eventName: string) => {
  if (oneTimeListeners[eventName]) {
    delete oneTimeListeners[eventName];
  }
};

/*
  eventListenerMiddleware

  Used to watch for specific redux actions, and potentially call one of our registered `oneTimeListeners`
  See explanation in nodeActions.ts for how this is used. 
*/
export const eventListenerMiddleware: Middleware<{}, {}> =
  () => next => action => {
    // this is way too complex, feels like there should be a better way
    if (oneTimeListeners[action.type]) {
      const listenersForEvent = [...oneTimeListeners[action.type]]; // make copy
      const indexesToRemove: number[] = [];
      for (let i = 0; i < listenersForEvent.length; i++) {
        const listener = listenersForEvent[i];
        if (listener.customPredicate) {
          if (listener.customPredicate(action)) {
            listener.callback(action);
            indexesToRemove.push(i);
          }
        } else {
          listener.callback(action);
          indexesToRemove.push(i);
        }
      }

      for (let i = indexesToRemove.length - 1; i >= 0; i--) {
        listenersForEvent.splice(indexesToRemove[i], 1);
      }

      oneTimeListeners[action.type] = listenersForEvent;
    }
    return next(action);
  };
