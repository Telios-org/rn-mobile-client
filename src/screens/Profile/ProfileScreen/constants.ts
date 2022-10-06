import { spacing } from '../../../util/spacing';

export const menuItems = [
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
    label: 'Sync New Device',
    key: 'sync-new-device',
    screenName: 'syncNewDevice',
    icon: 'ios-arrow-up-circle-outline',
  },
  {
    label: 'Statistics',
    key: 'statistics',
    screenName: 'statistics',
    icon: 'stats-chart-outline',
  },
  {
    label: 'Notifications',
    key: 'notifications',
    screenName: 'notifications',
    icon: 'notifications-outline',
  },
  {
    label: 'Log Out',
    key: 'log-out',
    screenName: 'login',
    icon: 'log-out-outline',
  },
];

export const launchImageErrorMessages = {
  camera_unavailable: 'Camera not available on device.',
  permission: 'Permission not satisfied.',
  others: 'An error occurred. Please try again later.',
  default: 'An error occurred. Please try again later.',
};
