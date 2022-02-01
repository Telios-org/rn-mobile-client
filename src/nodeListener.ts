import nodejs from 'nodejs-mobile-react-native';
import { AppDispatch } from './store';

export const createNodeListener = (dispatch: AppDispatch) => {
  nodejs.channel.addListener('message', msg => {
    console.log('From node: ', msg);
    const eventName = msg.event;
    if (eventName) {
      dispatch({ type: eventName, data: msg.data, error: msg.error });
    } else {
      console.log('unknown event type');
    }
  });
};
