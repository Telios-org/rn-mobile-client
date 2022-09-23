import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';
import { Icon } from '../../../Icon';
import { colors } from '../../../../util/colors';
import { fonts } from '../../../../util/fonts';

export const EmptyComponent = () => (
  <View style={styles.emptyComponentContainer}>
    <Icon name="file-tray-outline" size={50} color={colors.skyLight} />
    <Text style={[fonts.large.regular, { color: colors.skyLight }]}>
      {'No Messages'}
    </Text>
  </View>
);
