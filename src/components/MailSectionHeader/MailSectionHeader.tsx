import React from 'react';
import { Text, Pressable } from 'react-native';
import { Icon } from '../../components/Icon';
import { colors } from '../../util/colors';
import styles from './styles';

export type MailSectionHeaderProps = {
  title: string;
  count: number;
  icon?: string;
  iconSize: number;
  onPress?: () => void;
};

export const MailSectionHeader = ({
  title,
  count,
  icon,
  iconSize = 20,
  onPress,
}: MailSectionHeaderProps) => {
  return (
    <Pressable style={styles.sectionContainer} onPress={() => onPress?.()}>
      {icon && (
        <Icon
          name={icon}
          size={iconSize}
          color={colors.inkDarkest}
          style={styles.sectionIcon}
        />
      )}
      <Text style={[styles.sectionTitle, styles.text]}>{title}</Text>
      <Text style={styles.sectionCount}>{count}</Text>
    </Pressable>
  );
};
