import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../util/colors';
import React from 'react';
import backArrow from './utils/backArrow';
import SyncAccount from '../screens/SyncAccount';
import { Text, View } from 'react-native';
import { fonts } from '../util/fonts';
import { spacing } from '../util/spacing';
import { NavIconButton } from '../components/NavIconButton';
import SyncSuccess from '../screens/SyncSuccess';
import SyncQrCode from '../screens/SyncQrCode';
import SyncPending from '../screens/SyncPending';
import SyncPublicCode from '../screens/SyncPublicCode';
import SyncMasterPassword from '../screens/SyncMasterPassword';

export interface SyncData {
  driveKey: string;
  email: string;
}

export type SyncStackParams = {
  syncAccount: undefined;
  syncQrCode: undefined;
  syncPending: {
    masterPassword: string;
    syncData: SyncData;
  };
  syncMasterPassword: {
    syncData: SyncData;
  };
  syncSuccess: { email: string; masterPassword: string };
  syncPublicCode: undefined;
};

export const SyncStack = createNativeStackNavigator<SyncStackParams>();

const backOutline = ({ navigation }: any) => ({
  headerLeft: () => (
    <NavIconButton
      icon={{ name: 'close-outline', size: 28, color: colors.inkBase }}
      onPress={() => navigation.goBack()}
    />
  ),
});

const ScannerScreenTitle = () => {
  return (
    <View
      style={{
        backgroundColor: colors.skyLight,
        borderRadius: 50,
      }}>
      <Text
        style={[
          fonts.regular.regular,
          {
            color: colors.skyDark,
            marginHorizontal: spacing.md,
            marginVertical: spacing.sm,
          },
        ]}>
        Scan Code
      </Text>
    </View>
  );
};

export default () => (
  <SyncStack.Navigator
    initialRouteName="syncAccount"
    screenOptions={{
      headerBackTitleVisible: false,
      headerTransparent: true,
      title: '',
      headerTintColor: colors.primaryDark,
    }}>
    <SyncStack.Screen
      name="syncAccount"
      component={SyncAccount}
      options={backArrow}
    />
    <SyncStack.Screen
      name="syncQrCode"
      component={SyncQrCode}
      options={({ navigation }) => ({
        headerTitle: ScannerScreenTitle,
        headerTransparent: true,
        ...backOutline({ navigation }),
      })}
    />
    <SyncStack.Screen
      name="syncPublicCode"
      component={SyncPublicCode}
      options={backOutline}
    />
    <SyncStack.Screen
      name="syncPending"
      component={SyncPending}
      options={backOutline}
    />
    <SyncStack.Screen
      name="syncSuccess"
      component={SyncSuccess}
      options={backOutline}
    />
    <SyncStack.Screen
      name="syncMasterPassword"
      component={SyncMasterPassword}
      options={backOutline}
    />
  </SyncStack.Navigator>
);
