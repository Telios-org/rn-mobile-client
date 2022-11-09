import React from 'react';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import { fonts } from '../../util/fonts';
import ScrollableContainer from '../../components/ScrollableContainer';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SyncStackParams } from '../../navigators/Sync';
import useAccountSync from '../../hooks/useAccountSync';
import styles from './styles';
import { showToast } from '../../util/toasts';
import images from '../../assets/images';

type SyncPendingScreenProps = NativeStackScreenProps<
  SyncStackParams,
  'syncPending'
>;

export default ({ navigation, route }: SyncPendingScreenProps) => {
  const { syncData, masterPassword } = route.params;
  const onSyncSuccess = () => {
    navigation.navigate('syncSuccess', {
      email: syncData.email,
      masterPassword,
    });
  };

  const onSyncError = (error: any) => {
    showToast('error', 'Error on syncing account ' + error.message);
  };

  const { isLoading, initSync, filesSynced } = useAccountSync(
    onSyncSuccess,
    onSyncError,
  );

  const loadingComponent =
    filesSynced > 0 && filesSynced <= 100 ? (
      <Text style={styles.btnText}>{`${filesSynced}%`}</Text>
    ) : (
      <ActivityIndicator />
    );

  return (
    <ScrollableContainer>
      <Text style={fonts.title2}>Syncing</Text>
      <Text style={styles.syncingMessage}>
        Syncing account data. This may take a minute.
      </Text>
      <View style={styles.imageContainer}>
        <Image source={images.syncPending} style={styles.image} />
      </View>
      <Pressable
        disabled={isLoading}
        style={[styles.button, { opacity: isLoading ? 0.5 : 1 }]}
        onPress={() => initSync(syncData, masterPassword)}>
        {isLoading ? (
          loadingComponent
        ) : (
          <Text style={styles.btnText}>Continue</Text>
        )}
      </Pressable>
    </ScrollableContainer>
  );
};
