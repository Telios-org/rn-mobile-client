import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { IntroScreen } from './screens/IntroScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { LoginScreen } from './screens/LoginScreen';
import { InboxScreen } from './screens/InboxScreen';
import { useAppSelector, useIsAuthenticated } from './hooks';
import { DrawerContent } from './components/DrawerContent';
import { ComposeScreen } from './screens/ComposeScreen';
import { TestScreen } from './screens/TestScreen';
import { RegisterBetaCodeScreen } from './screens/RegisterBetaCodeScreen';
import { colors } from './util/colors';

export type RootStackParams = {
  test: undefined;
  intro: undefined;
  register: undefined;
  login: undefined;
  main: undefined;
  compose: undefined;
  registerBetaCode: undefined;
  registerConsent: undefined;
  registerUsername: undefined;
  registerPassword: undefined;
  registerRecoveryEmail: undefined;
  registerSuccess: undefined;
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
  const localUsernames = useAppSelector(state => state.main.localUsernames);
  const hasLocalAccount = localUsernames.length > 0;
  const isAuthenticated = useIsAuthenticated();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={hasLocalAccount ? 'login' : 'intro'}>
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
              name={'intro'}
              component={IntroScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={'register'}
              component={RegisterScreen}
              options={{ title: 'Register' }}
            />
            <Stack.Screen
              name={'login'}
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="test"
              component={TestScreen}
              options={{ title: 'Test' }}
            />
            <Stack.Screen
              name="registerBetaCode"
              component={RegisterBetaCodeScreen}
              options={{
                headerBackTitleVisible: false,
                headerTransparent: true,
                title: '',
                headerTintColor: colors.primaryDark,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
