import { useEffect } from 'react';
import { InteractionManager } from 'react-native';
import { useDispatch } from 'react-redux';
import { getNewMailFlow } from '../store/thunks/email';

/** This hook is a temporary solution to listen for new messages */
export default (isReady: boolean) => {
  const dispatch = useDispatch();

  useEffect(() => {
    let intervalCleanupId: NodeJS.Timer;
    if (isReady) {
      intervalCleanupId = setInterval(
        () =>
          InteractionManager.runAfterInteractions(() => {
            dispatch(getNewMailFlow());
          }),
        30000,
      );
    }
    return () => intervalCleanupId && clearInterval(intervalCleanupId);
  }, [isReady]);
};
