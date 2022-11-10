import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../util/colors';
import ForgotPassword from '../screens/ForgotPassword';
import EnterNewPassword from '../screens/EnterNewPassword';
import RecoverAccount from '../screens/RecoverAccount';
import RecoverAccountCode from '../screens/RecoverAccountCode';
import React from 'react';
import { NavIconButton } from '../components/NavIconButton';

export type RecoveryAccountStackParams = {
  forgotPassword: undefined;
  enterNewPassword: { passphrase?: string; hasValidCode?: boolean };
  recoverAccount: undefined;
  recoverAccountCode: { recoveryEmail: string };
};
export const RecoveryAccountStack =
  createNativeStackNavigator<RecoveryAccountStackParams>();

const showBackArrow = ({ navigation }: any) => ({
  headerLeft: () => (
    <NavIconButton
      icon={{ name: 'chevron-back', size: 28 }}
      onPress={() => navigation.goBack()}
    />
  ),
});

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
    <RecoveryAccountStack.Screen
      name="recoverAccount"
      component={RecoverAccount}
      options={showBackArrow}
    />
    <RecoveryAccountStack.Screen
      name="recoverAccountCode"
      component={RecoverAccountCode}
      options={showBackArrow}
    />
  </RecoveryAccountStack.Navigator>
);
