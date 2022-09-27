import { ComposeNewEmailButton } from '../ComposeNewEmailButton';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default () => {
  const navigation = useNavigation<any>();
  const onNewEmail = () => {
    navigation.navigate('compose');
  };
  return <ComposeNewEmailButton onPress={onNewEmail} />;
};
