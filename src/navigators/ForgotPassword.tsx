import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../util/colors';
import ForgotPassword from '../screens/ForgotPassword';
import EnterNewPassword from '../screens/EnterNewPassword';
import showBackArrow from './utils/backArrow';

export type ForgotPasswordStackParams = {
  forgotPassword: undefined;
  enterNewPassword: { passphrase?: string; hasValidCode?: boolean };
};
export const RecoveryAccountStack =
  createNativeStackNavigator<ForgotPasswordStackParams>();

export default () => (
  <RecoveryAccountStack.Navigator
    initialRouteName="forgotPassword"
    screenOptions={{
      headerBackTitleVisible: false,
      headerTransparent: true,
      title: '',
      headerTintColor: colors.primaryDark,
    }}>
    <RecoveryAccountStack.Screen
      name="forgotPassword"
      component={ForgotPassword}
      options={showBackArrow}
    />
    <RecoveryAccountStack.Screen
      name="enterNewPassword"
      component={EnterNewPassword}
      options={showBackArrow}
    />
  </RecoveryAccountStack.Navigator>
);
