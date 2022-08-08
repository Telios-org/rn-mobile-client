import React from 'react';
import { KeyboardAvoidingView, StyleProp, ViewStyle } from 'react-native';
import { Button, ButtonProps } from '../Button';
import styles from './styles';
import { useHeaderHeight } from '@react-navigation/elements';
import { isIOS } from '../../util/platform';

interface NextButtonProps {
  disabled?: ButtonProps['disabled'];
  onSubmit: ButtonProps['onPress'];
  loading?: ButtonProps['loading'];
  useKeyboardAvoidingView?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default ({
  disabled,
  onSubmit,
  loading,
  style,
  useKeyboardAvoidingView = true,
}: NextButtonProps) => {
  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAvoidingView
      enabled={useKeyboardAvoidingView}
      keyboardVerticalOffset={30 + headerHeight}
      behavior={isIOS ? 'padding' : 'height'}
      style={[styles.button, style]}>
      <Button
        size="block"
        title="Next"
        disabled={disabled}
        onPress={onSubmit}
        loading={loading}
      />
    </KeyboardAvoidingView>
  );
};
