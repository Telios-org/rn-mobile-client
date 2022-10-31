import React, { memo, useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';

import { IconButton } from '../../../components/IconButton';
import { Label } from '../../../components/Input';

import { colors } from '../../../util/colors';
import styles from './styles';

type InformationFiledProps = {
  title: string;
  value: string;
  shouldHide: boolean;
};

const InformationFiled = ({
  title,
  value,
  shouldHide,
}: InformationFiledProps) => {
  const [isHidden, setIsHidden] = useState<boolean>(shouldHide);

  const maskedValue = useCallback(() => {
    let text = '';
    value?.split('')?.forEach(() => (text += 'x'));
    return text;
  }, [value]);

  const copyToClipboard = () => {
    Clipboard.setString(value);
    Toast.show({
      type: 'info',
      text1: `${title} copied.`,
    });
  };

  const toggleHiddenType = () => setIsHidden(prev => !prev);

  return (
    <>
      <View style={styles.row}>
        <Label label={title} />
        {shouldHide && (
          <IconButton
            name={isHidden ? 'ios-eye-off-outline' : 'ios-eye-outline'}
            color={colors.inkLighter}
            size={18}
            onPress={toggleHiddenType}
            style={styles.copyIcon}
          />
        )}
      </View>
      <View style={styles.field}>
        <Text style={styles.value}>{isHidden ? maskedValue() : value}</Text>
        <IconButton
          name="ios-copy-outline"
          color={colors.inkLighter}
          size={20}
          onPress={copyToClipboard}
          style={styles.copyIcon}
        />
      </View>
      <View style={styles.divider} />
    </>
  );
};

export default memo(InformationFiled);
