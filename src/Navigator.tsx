import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { WelcomeScreen } from './screens/WelcomeScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { LoginScreen } from './screens/LoginScreen';
import { InboxScreen } from './screens/InboxScreen';
import { useAppSelector } from './hooks';

export type RootStackParams = {
  welcome: undefined;
  register: undefined;
  login: undefined;
  main: undefined;
};

export type MainStackParams = {
  inbox: undefined;
};

const Stack = createNativeStackNavigator<RootStackParams>();
const Drawer = createDrawerNavigator<MainStackParams>();

function Main() {
  return (
    <Drawer.Navigator initialRouteName="inbox">
      <Drawer.Screen name={'inbox'} component={InboxScreen} />
    </Drawer.Navigator>
  );
}

export const Navigator = () => {
  const mainState = useAppSelector(state => state.main);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {mainState.isAuthenticated ? (
          <Stack.Screen
            name="main"
            component={Main}
            options={{ headerShown: false }}
          />
        ) : (
          <>
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
