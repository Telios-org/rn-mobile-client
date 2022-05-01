import nodejs from 'nodejs-mobile-react-native';
import { AppDispatch } from './store';

/*
  createNodeListener

  This function is what listens to Node events and forwards them to Redux, 
  to be utilized by our Redux middlewares. 
  
*/
export const createNodeListener = (dispatch: AppDispatch) => {
  nodejs.channel.addListener('message', msg => {
    const eventName = msg.event;
    if (eventName) {
      dispatch({ type: `node/${eventName}`, data: msg.data, error: msg.error });
    } else {
      console.log('unknown event type');
    }
  });
};
