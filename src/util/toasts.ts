import Toast, { ToastOptions } from 'react-native-toast-message';

export const showToast = (
  type: 'success' | 'error' | 'info',
  errorMessage: string,
  opts?: ToastOptions,
) =>
  Toast.show({
    type: type,
    text1: errorMessage,
    ...opts,
  });
