import { useEffect, useState } from 'react';
import {
  ACCOUNT_SYNC_EVENT,
  ACCOUNT_SYNC_EVENT_CALLBACK,
} from '../store/types/events';
import { SyncData } from '../navigators/Sync';
import nodejs from 'nodejs-mobile-react-native';

interface AccountSyncProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface AccountSyncOpts {
  initSync: (syncData: SyncData, password: string) => void;
  isLoading: boolean;
  filesSynced: number;
}

export default (
  onSuccess?: AccountSyncProps['onSuccess'],
  onError?: AccountSyncProps['onError'],
): AccountSyncOpts => {
  const [percentage, setPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const initSync = (syncData: SyncData, masterPassword: string) => {
    setIsLoading(true);
    if (masterPassword && syncData) {
      nodejs.channel.send({
        event: ACCOUNT_SYNC_EVENT,
        payload: {
          deviceType: 'MOBILE',
          password: masterPassword,
          ...syncData,
        },
      });
    }
  };

  useEffect(() => {
    const syncEventCallback = (msg: any) => {
      const { event, data, error } = msg;
      if (event === ACCOUNT_SYNC_EVENT_CALLBACK) {
        if (error) {
          setIsLoading(false);
          onError?.(error);
          return;
        }

        if ('files' in data) {
          const p = data.files.index / data.files.total;
          setPercentage(Math.floor((isFinite(p) ? p : 0) * 100));
        }

        if ('searchIndex' in data && data.searchIndex.emails) {
          onSuccess?.();
          setIsLoading(false);
        }
      }
    };
    nodejs.channel.addListener('message', syncEventCallback);

    return () => {
      nodejs.channel.removeListener('message', syncEventCallback);
    };
  }, []);

  return {
    initSync,
    isLoading,
    filesSynced: percentage,
  };
};
