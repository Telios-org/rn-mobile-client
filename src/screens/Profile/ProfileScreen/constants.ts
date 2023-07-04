import { StyleProp, ViewStyle } from 'react-native';
import { spacing } from '../../../util/spacing';

type MenuItem = {
  label: string;
  key: string;
  screenName: string;
  icon: string;
  style?: StyleProp<ViewStyle>;
};

export const menuItems: MenuItem[] = [
  {
    label: 'Contacts',
    key: 'contacts',
    screenName: 'contacts',
    icon: 'ios-people-outline',
    style: {
      marginBottom: spacing.xl,
    },
  },
  {
    label: 'Plan & Usage',
    key: 'plan-usage',
    screenName: 'planAndUsage',
    icon: 'ios-wallet-outline',
  },
  {
    label: 'Sync New Device',
    key: 'sync-new-device',
    screenName: 'syncNewDevice',
    icon: 'ios-arrow-up-circle-outline',
  },
  {
    label: 'Security',
    key: 'security',
    screenName: 'security',
    icon: 'ios-shield-checkmark-outline',
  },
  {
    label: 'Biometric Settings',
    key: 'biometricSettings',
    screenName: 'biometricSettings',
    icon: 'ios-scan',
  },
  {
    label: 'Log Out',
    key: 'log-out',
    screenName: 'login',
    icon: 'log-out-outline',
  },
];

export const launchImageErrorMessages: { [key: string]: string } = {
  camera_unavailable: 'Camera not available on device.',
  permission: 'Permission not satisfied.',
  others: 'An error occurred. Please try again later.',
  default: 'An error occurred. Please try again later.',
};
