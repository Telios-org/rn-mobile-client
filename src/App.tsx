import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { useEffect } from 'react';
import { start } from './util/nodeApi';

export type RootStackParams = {
  welcome: undefined;
  register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParams>();

export default function App() {
  useEffect(() => {
    start();
  }, []);

  return (
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
  );
}
