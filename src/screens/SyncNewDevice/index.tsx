import { Text, View } from 'react-native';
import { fonts } from '../../util/fonts';
import React, { useEffect, useState } from 'react';
import ScrollableContainer from '../../components/ScrollableContainer';
import { Button } from '../../components/Button';
import { colors } from '../../util/colors';
import QRCode from 'react-qr-code';
import { useAppDispatch } from '../../hooks';
import styles from './styles';
import * as Clipboard from 'expo-clipboard';
import {
  createAccountSyncInfo,
  CreateAccountSyncInfoResponse,
} from '../../store/thunks/account';
import { showToast } from '../../util/toasts';

export default () => {
  const dispatch = useAppDispatch();
  const [showQrCode, setShowQrCode] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [syncInfo, setSyncInfo] = useState<
    CreateAccountSyncInfoResponse | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);

  const onPressGenerateQrCode = () => {
    setShowCode(false);
    setShowQrCode(!showQrCode);
  };
  const onPressGenerateCode = () => {
    setShowQrCode(false);
    setShowCode(!showCode);
  };

  const onCopyToClipboard = () => {
    if (syncInfo) {
      Clipboard.setString(syncInfo.code);
    }
  };

  const generateSyncInfo = async () => {
    if (showCode || (showQrCode && !syncInfo?.email && !syncInfo?.drive_key)) {
      try {
        setIsLoading(true);
        const resp = await dispatch(createAccountSyncInfo()).unwrap();
        setSyncInfo(resp);
      } catch (error) {
        showToast(
          'error',
          'Something went wrong while getting sync info, please try again.',
        );
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateSyncInfo();
  }, [showCode, showQrCode]);

  return (
    <ScrollableContainer>
      <Text style={styles.syncIncetive}>
        Use QR code or expiration code to sync your account on other devices.
      </Text>
      <Button
        loading={isLoading && showQrCode}
        title="Generate QR Code"
        onPress={onPressGenerateQrCode}
        style={styles.generateQrBtn}
        iconLeft={{ name: 'camera-outline', color: 'white', size: 26 }}
      />
      {syncInfo && showQrCode && (
        <View style={styles.qrCode}>
          <QRCode
            value={JSON.stringify({
              email: syncInfo.email,
              drive_key: syncInfo.drive_key,
            })}
          />
        </View>
      )}
      <Button
        type="outline"
        loading={isLoading && showCode}
        title="Get code for manual sync"
        onPress={onPressGenerateCode}
        style={styles.generateCodeBtn}
        iconLeft={{ name: 'ios-pencil-sharp', color: colors.primaryBase }}
      />
      {syncInfo && showCode && !isLoading && (
        <>
          <View style={styles.codeText}>
            <Text style={fonts.large.bold}>{syncInfo.code}</Text>
          </View>
          <Button
            type="text"
            title="copy to clipboard"
            onPress={onCopyToClipboard}
          />
        </>
      )}
    </ScrollableContainer>
  );
};
