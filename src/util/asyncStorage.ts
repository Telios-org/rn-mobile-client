import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  savedUsernames: '@saved_usernames_json',
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
