import React, { useEffect, useState } from 'react';
import { Switch, Text, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import cloneDeep from 'lodash/cloneDeep';
import { updateBiometricUseStatus } from '../../store/account';
import {
  selectBiometricUseStatus,
  selectLastLoggedUsername,
} from '../../store/selectors/account';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { storeAsyncStorageBiometricUseStatus } from '../../util/asyncStorage';
import { checkIsBiometricAvailable } from '../../util/biometric';
import { colors } from '../../util/colors';
import styles from './styles';

const BiometricSettings = () => {
  const [isBiometricAvailable, setIsBiometricAvailable] =
    useState<boolean>(false);
  const [usingStatus, setUsingStatus] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const lastLoggedUsername = useAppSelector(selectLastLoggedUsername);
  const biometricUseStatus = useAppSelector(selectBiometricUseStatus);

  useEffect(() => {
    (async () => {
      const isBiometricAvailableResult = await checkIsBiometricAvailable();
      setIsBiometricAvailable(isBiometricAvailableResult);
      if (lastLoggedUsername) {
        setUsingStatus(!!biometricUseStatus?.[lastLoggedUsername]);
      }
    })();
  }, [biometricUseStatus, lastLoggedUsername]);

  const handleUsingStatusChange = async (updatedStatus: boolean) => {
    setUsingStatus(updatedStatus);
    if (isBiometricAvailable && lastLoggedUsername) {
      await LocalAuthentication.authenticateAsync({
        promptMessage:
          'To change Telios uses settings, you must have identity verification.',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      }).then(async res => {
        if (res?.success && lastLoggedUsername) {
          const newBiometricUseStatus = cloneDeep(biometricUseStatus);
          newBiometricUseStatus[lastLoggedUsername] = updatedStatus;
          dispatch(updateBiometricUseStatus(newBiometricUseStatus));
          await storeAsyncStorageBiometricUseStatus(
            lastLoggedUsername,
            updatedStatus,
          );
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingContainer}>
        <View>
          <Text style={styles.settingText}>Use biometrics</Text>
          {!isBiometricAvailable && (
            <Text style={styles.errorText}>
              {'Your device does not include this feature.'}
            </Text>
          )}
        </View>
        <Switch
          value={usingStatus}
          trackColor={{
            false: colors.inkLighter,
            true: colors.primaryBase,
          }}
          disabled={!isBiometricAvailable}
          onValueChange={handleUsingStatusChange}
        />
      </View>
      <Text style={styles.description}>
        {
          'You will be able to login to your Telios account us gin TouchID or Face ID without entering the password'
        }
      </Text>
    </View>
  );
};

export default BiometricSettings;
