import React from 'react';
import { View } from 'react-native';
import { Button, ButtonProps } from '../Button';
import styles from './styles';

interface NextButtonProps {
  disabled?: ButtonProps['disabled'];
  onSubmit: ButtonProps['onPress'];
  loading?: ButtonProps['loading'];
}

export default ({ disabled, onSubmit, loading }: NextButtonProps) => {
  return (
    <View style={styles.button}>
      <Button
        size="block"
        title="Next"
        disabled={disabled}
        onPress={onSubmit}
        loading={loading}
      />
    </View>
  );
};
