import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  savedUsernames: '@saved_usernames_json',
  lastUsername: '@last_used_username_string',
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
