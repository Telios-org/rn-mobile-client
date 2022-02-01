// necessary to import this first: https://reactnavigation.org/docs/drawer-navigator/#installation
import 'react-native-gesture-handler';

import nodejs from 'nodejs-mobile-react-native';

setTimeout(() => {
  console.log('starting nodejs bundle...');
  nodejs.start('bundle.js');
}, 1);

import React from 'react';
import { store } from './store';
import { Provider } from 'react-redux';
import { ListenerContainer } from './ListenerContainer';
import { Navigator } from './Navigator';

export default function App() {
  return (
    <Provider store={store}>
      <ListenerContainer />
      <Navigator />
    </Provider>
  );
}
