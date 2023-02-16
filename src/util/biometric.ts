import * as LocalAuthentication from 'expo-local-authentication';

export const checkIsBiometricAvailable = async (): Promise<boolean> => {
  return await LocalAuthentication.hasHardwareAsync();
};
