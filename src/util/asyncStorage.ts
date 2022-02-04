import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  savedUsernames: '@saved_usernames_json',
};

const getSavedUsernames = async () => {
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
export const storeSavedUsername = async (email: string) => {
  const savedUsernames = await getSavedUsernames();
  if (savedUsernames.includes(email)) {
    return;
  } else {
    savedUsernames.push(email);
  }
  const jsonValue = JSON.stringify(savedUsernames);
  await AsyncStorage.setItem(storage.savedUsernames, jsonValue);
};
