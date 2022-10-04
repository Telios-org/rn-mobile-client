import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../util/colors';
import { fonts } from '../util/fonts';
import { spacing } from '../util/spacing';
import MailListHeaderTitle from './MailListHeaderTitle';
import { Icon } from './Icon';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';

export type MailListHeaderProps = {
  title: string;
  subtitle?: string;
  canCopySubtitle?: boolean;
  showCurrentStatus?: boolean;
  showBottomSeparator?: boolean;
  isActive?: boolean;
};

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: 'white',
  },
  subtitleContainer: {
    flexDirection: 'row',
  },
  bottomSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: colors.skyLighter,
  },
});

export const MailListHeader = ({
  title,
  subtitle,
  showCurrentStatus,
  showBottomSeparator,
  isActive,
  canCopySubtitle,
}: MailListHeaderProps) => {
  const copySubtitleBtn = canCopySubtitle && (
    <Pressable
      onPress={() => {
        if (subtitle) {
          Clipboard.setString(subtitle);
          Toast.show({
            type: 'info',
            text1: 'Text copied',
          });
        }
      }}>
      <Icon name="copy-outline" size={14} color={colors.inkLighter} />
    </Pressable>
  );
  return (
    <View
      style={[styles.container, showBottomSeparator && styles.bottomSeparator]}>
      <MailListHeaderTitle
        title={title}
        isActive={isActive}
        showCurrentStatus={showCurrentStatus}
      />
      {!!subtitle && (
        <View style={styles.subtitleContainer}>
          <Text
            style={[
              fonts.small.regular,
              { color: colors.inkLighter, marginRight: 11 },
            ]}>
            {subtitle}
          </Text>
          {copySubtitleBtn}
        </View>
      )}
    </View>
  );
};
