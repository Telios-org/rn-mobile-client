import * as SecureStore from 'expo-secure-store';

export function setStoreData(
  key: string,
  value: any,
  options?: SecureStore.SecureStoreOptions,
) {
  const preparedValue: string =
    typeof value === 'string' ? value : JSON.stringify(value);
  const storeOptions = options || {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  };
  SecureStore.setItemAsync(key, preparedValue, storeOptions);
}

export async function getStoredValue(key: string) {
  let result = await SecureStore.getItemAsync(key);
  return result && JSON.parse(result);
}

export const ACCOUNT_AUTHENTICATION_KEY = 'ACCOUNT_AUTHENTICATION_KEY';
