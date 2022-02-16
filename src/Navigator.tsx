import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Host } from 'react-native-portalize';

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
import { RegisterConsentScreen } from './screens/RegisterConsentScreen';
import { RegisterUsernameScreen } from './screens/RegisterUsernameScreen';
import { RegisterPasswordScreen } from './screens/RegisterPasswordScreen';
import { RegisterRecoveryEmailScreen } from './screens/RegisterRecoveryEmailScreen';
import { RegisterSuccessScreen } from './screens/RegisterSuccessScreen';

export type RootStackParams = {
  test: undefined;
  intro: undefined;
  register: undefined;
  login: undefined;
  main: undefined;
  compose: undefined;
  registerBetaCode: undefined;
  registerConsent: { code: string };
  registerUsername: { code: string; accepted: boolean };
  registerPassword: { code: string; accepted: boolean; email: string };
  registerRecoveryEmail: {
    code: string;
    accepted: boolean;
    email: string;
    password: string;
  };
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
      <Host>
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
                <Stack.Screen
                  name="registerSuccess"
                  component={RegisterSuccessScreen}
                  options={{
                    headerBackTitleVisible: false,
                    headerTransparent: true,
                    title: '',
                    headerTintColor: colors.primaryDark,
                  }}
                />
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

              {/* register screens */}
              <Stack.Group
                screenOptions={{
                  headerBackTitleVisible: false,
                  headerTransparent: true,
                  title: '',
                  headerTintColor: colors.primaryDark,
                }}>
                <Stack.Screen
                  name="registerBetaCode"
                  component={RegisterBetaCodeScreen}
                />
                <Stack.Screen
                  name="registerConsent"
                  component={RegisterConsentScreen}
                />
                <Stack.Screen
                  name="registerUsername"
                  component={RegisterUsernameScreen}
                />
                <Stack.Screen
                  name="registerPassword"
                  component={RegisterPasswordScreen}
                />
                <Stack.Screen
                  name="registerRecoveryEmail"
                  component={RegisterRecoveryEmailScreen}
                />
              </Stack.Group>
            </>
          )}
        </Stack.Navigator>
      </Host>
    </NavigationContainer>
  );
};
