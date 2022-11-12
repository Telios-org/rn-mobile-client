import { ComposeNewEmailButton } from '../ComposeNewEmailButton';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default ({ from }: { from?: string }) => {
  const navigation = useNavigation<any>();
  const onNewEmail = () => {
    navigation.navigate('compose', { from });
  };
  return <ComposeNewEmailButton onPress={onNewEmail} />;
};
