import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { RegisterBetaCodeScreen } from './screens/RegisterBetaCodeScreen';
import { RegisterConsentScreen } from './screens/RegisterConsentScreen';
import { RegisterEmailScreen } from './screens/RegisterEmailScreen';
import { RegisterPasswordScreen } from './screens/RegisterPasswordScreen';
import { RegisterRecoveryEmailScreen } from './screens/RegisterRecoveryEmailScreen';
import { RegisterSummaryScreen } from './screens/RegisterSummaryScreen';

export type RootStackParams = {
  welcome: undefined;
  registerBetaCode: undefined;
  registerConsent: undefined;
  registerEmail: undefined;
  registerPassword: undefined;
  registerRecoveryEmail: undefined;
  registerSummary: undefined;
};

const Stack = createNativeStackNavigator<RootStackParams>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={'welcome'}
          component={WelcomeScreen}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen
          name={'registerBetaCode'}
          component={RegisterBetaCodeScreen}
          options={{ title: 'Beta Code' }}
        />
        <Stack.Screen
          name={'registerConsent'}
          component={RegisterConsentScreen}
          options={{ title: 'Beta Consent' }}
        />
        <Stack.Screen
          name={'registerEmail'}
          component={RegisterEmailScreen}
          options={{ title: 'Choose Email' }}
        />
        <Stack.Screen
          name={'registerPassword'}
          component={RegisterPasswordScreen}
          options={{ title: 'Master Password' }}
        />
        <Stack.Screen
          name={'registerRecoveryEmail'}
          component={RegisterRecoveryEmailScreen}
          options={{ title: 'Recovery Email' }}
        />
        <Stack.Screen
          name={'registerSummary'}
          component={RegisterSummaryScreen}
          options={{ title: 'Summary' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
