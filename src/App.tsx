import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { store } from './store';
import { Provider } from 'react-redux';

export type RootStackParams = {
  welcome: undefined;
  register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParams>();

export default function App() {
  return (
    <Provider store={store}>
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
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
