import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { store } from './store';
import { Provider } from 'react-redux';
import { LoginScreen } from './screens/LoginScreen';
import { createNodeListener } from './nodeListener';
import { useAppDispatch } from './hooks';
import { ListenerContainer } from './ListenerContainer';

export type RootStackParams = {
  welcome: undefined;
  register: undefined;
  login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParams>();

export default function App() {
  return (
    <Provider store={store}>
      <ListenerContainer />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name={'welcome'}
            component={WelcomeScreen}
            options={{ title: 'Welcome' }}
          />
          <Stack.Screen
            name={'register'}
            component={RegisterScreen}
            options={{ title: 'Register' }}
          />
          <Stack.Screen
            name={'login'}
            component={LoginScreen}
            options={{ title: 'Login' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
