import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  savedUsernames: '@saved_usernames_json',
  lastUsername: '@last_used_username_string',
  biometricUseStatus: '@biometric_use_status',
};

export const getAsyncStorageSavedUsernames = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(storage.savedUsernames);
    const usernames =
      jsonValue != null ? (JSON.parse(jsonValue) as string[]) : [];
    return usernames;
  } catch (e) {
    // error reading value
    console.log('ERROR GETTING USERNAMES: ', e);
    return [];
  }
};

// @throwable
export const storeAsyncStorageSavedUsername = async (email: string) => {
  const savedUsernames = await getAsyncStorageSavedUsernames();
  if (savedUsernames.includes(email)) {
    return;
  } else {
    savedUsernames.push(email);
  }
  const jsonValue = JSON.stringify(savedUsernames);
  await AsyncStorage.setItem(storage.savedUsernames, jsonValue);
};

export const getAsyncStorageLastUsername = async () => {
  try {
    const value = (await AsyncStorage.getItem(storage.lastUsername)) as
      | string
      | undefined;
    return value;
  } catch (e) {
    // error reading value
    console.log('ERROR GETTING USERNAME: ', e);
    return undefined;
  }
};

// @throwable
export const storeAsyncStorageLastUsername = async (email: string) => {
  await AsyncStorage.setItem(storage.lastUsername, email);
};

export const getAsyncStorageBiometricUseStatus = async (): Promise<{
  [key: string]: boolean;
}> => {
  try {
    const jsonValue = await AsyncStorage.getItem(storage.biometricUseStatus);
    const biometricUseStatus =
      jsonValue != null
        ? (JSON.parse(jsonValue) as {
            [key: string]: boolean;
          })
        : {};
    return biometricUseStatus;
  } catch (e) {
    // error reading value
    console.log('ERROR GETTING BIOMETRIC USE STATUS: ', e);
    return {};
  }
};

export const storeAsyncStorageBiometricUseStatus = async (
  email: string,
  usingStatus: boolean,
) => {
  const biometricUseStatus: {
    [key: string]: boolean;
  } = await getAsyncStorageBiometricUseStatus();
  biometricUseStatus[email] = usingStatus;
  const jsonValue = JSON.stringify(biometricUseStatus);
  await AsyncStorage.setItem(storage.biometricUseStatus, jsonValue);
};
