import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { store } from '../store';

interface AppStateListener {
  onPause?: () => void;
  onResume?: () => void;
  isReady?: boolean;
}
export default ({ onPause, onResume, isReady }: AppStateListener) => {
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    console.log('app state effect', isReady, store.getState());
    if (isReady) {
      const subscription = AppState.addEventListener('change', nextAppState => {
        console.log('app state change', nextAppState, appState.current);
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'background'
        ) {
          console.log('App has come to the background!');
          onPause?.();
        }

        if (appState.current.match(/background/) && nextAppState === 'active') {
          console.log('App has come to the foreground!');
          onResume?.();
        }
        appState.current = nextAppState;
      });
      return () => {
        console.log('app state effect cleanup');
        subscription.remove();
      };
    }
  }, [isReady]);
};
