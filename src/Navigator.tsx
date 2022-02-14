import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { WelcomeScreen } from './screens/WelcomeScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { LoginScreen } from './screens/LoginScreen';
import { InboxScreen } from './screens/InboxScreen';
import { useAppSelector, useIsAuthenticated } from './hooks';
import { DrawerContent } from './components/DrawerContent';
import { ComposeScreen } from './screens/ComposeScreen';
import { TestScreen } from './screens/TestScreen';

export type RootStackParams = {
  test: undefined;
  welcome: undefined;
  register: undefined;
  login: undefined;
  main: undefined;
  compose: undefined;
};

export type MainStackParams = {
  inbox: undefined;
};

const Stack = createNativeStackNavigator<RootStackParams>();
const Drawer = createDrawerNavigator<MainStackParams>();

function Main() {
  return (
    <Drawer.Navigator initialRouteName="inbox" drawerContent={DrawerContent}>
      <Drawer.Screen name={'inbox'} component={InboxScreen} />
    </Drawer.Navigator>
  );
}

export const Navigator = () => {
  const isAuthenticated = useIsAuthenticated();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="test">
        {isAuthenticated ? (
          <>
            <Stack.Group>
              <Stack.Screen
                name="main"
                component={Main}
                options={{ headerShown: false }}
              />
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name="compose" component={ComposeScreen} />
            </Stack.Group>
          </>
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
            <Stack.Screen
              name="test"
              component={TestScreen}
              options={{ title: 'Test' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
