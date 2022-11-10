import React from 'react';
import { BarCodeEvent, BarCodeScanner } from 'expo-barcode-scanner';
import styles from './styles';
import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SyncStackParams } from '../../navigators/Sync';
import BarcodeMask from '../../components/BarcodeMask';

type SyncQrCodeScreenProps = NativeStackScreenProps<
  SyncStackParams,
  'syncQrCode'
>;

export default ({ navigation }: SyncQrCodeScreenProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: BarCodeEvent) => {
    if (data) {
      try {
        const scannedData: { email: string; drive_key: string } =
          JSON.parse(data);
        navigation.replace('syncMasterPassword', {
          syncData: {
            email: scannedData.email,
            driveKey: scannedData.drive_key,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.errorContainer}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.errorContainer}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={styles.bareCodeScanner}>
        <BarcodeMask />
      </BarCodeScanner>
    </View>
  );
};
