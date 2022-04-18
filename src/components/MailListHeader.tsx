import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '../util/colors';
import { fonts } from '../util/fonts';
import { spacing } from '../util/spacing';

export type MailListHeaderProps = {
  title: string;
  subtitle?: string;
};

export const MailListHeader = (props: MailListHeaderProps) => {
  return (
    <View
      style={{
        paddingTop: spacing.md,
        paddingBottom: spacing.lg,
        paddingHorizontal: spacing.md,
      }}>
      <Text style={fonts.title2}>{props.title}</Text>
      {!!props.subtitle && (
        <Text style={[fonts.regular.regular, { color: colors.inkLighter }]}>
          {props.subtitle}
        </Text>
      )}
    </View>
  );
};
