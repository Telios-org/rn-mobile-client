import nodejs from 'nodejs-mobile-react-native';
import { AppDispatch } from './store';

export const createNodeListener = (dispatch: AppDispatch) => {
  console.log('starting nodejs bundle...');
  nodejs.start('bundle.js');
  nodejs.channel.addListener('message', msg => {
    console.log('From node: ', msg);
    const eventName = msg.event;
    const body = msg.data;
    dispatch({ type: eventName, payload: body });
  });
};
