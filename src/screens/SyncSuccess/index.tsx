import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { fonts } from '../../util/fonts';
import ScrollableContainer from '../../components/ScrollableContainer';
import styles from './styles';
import { Button } from '../../components/Button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SyncStackParams } from '../../navigators/Sync';
import { useAppDispatch } from '../../hooks';
import { accountLogout } from '../../store/thunks/accountLogout';
import { loginFlow } from '../../store/thunks/account';
import images from '../../assets/images';
import { showToast } from '../../util/toasts';

type SyncSuccessScreenProps = NativeStackScreenProps<
  SyncStackParams,
  'syncSuccess'
>;

export default ({ route }: SyncSuccessScreenProps) => {
  const { email, masterPassword } = route.params;
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const onPressContinue = async () => {
    try {
      setIsLoading(true);
      // need to log out before login again
      await dispatch(accountLogout());
      // navigate automatically to main screen
      await dispatch(loginFlow({ email, password: masterPassword })).unwrap();
    } catch (error) {
      showToast('error', 'Error on logging in.');
      setIsLoading(false);
    }
  };

  return (
    <ScrollableContainer>
      <Text style={fonts.title2}>Account Synced</Text>
      <Text style={styles.successText}>Success!</Text>
      <Text style={styles.syncMessage}>
        You can now log in with your synced account.
      </Text>
      <View style={styles.imageContainer}>
        <Image source={images.syncSuccess} style={styles.image} />
      </View>
      <Button
        loading={isLoading}
        title="Continue"
        onPress={onPressContinue}
        style={styles.button}
      />
    </ScrollableContainer>
  );
};
