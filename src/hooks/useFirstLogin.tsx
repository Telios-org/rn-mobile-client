import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { selectIsFirstSignIn } from '../store/selectors/account';
import { checkIsBiometricAvailable } from '../util/biometric';

export default () => {
  const isFirstSignIn = useSelector(selectIsFirstSignIn);
  const navigation = useNavigation<any>();

  useEffect(() => {
    (async () => {
      const isBiometricAvailable = await checkIsBiometricAvailable();
      if ((isBiometricAvailable && isFirstSignIn) || 1) {
        Alert.alert(
          'Login with Biometric',
          'Would you want to use FaceID for login?',
          [
            {
              text: 'No',
              style: 'default',
            },
            {
              text: 'Yes',
              onPress: () => handleUseFaceID(),
              style: 'default',
            },
          ],
        );
      }
    })();
  }, [isFirstSignIn]);

  const handleUseFaceID = () => {
    navigation.navigate('biometricSettings');
  };
};
