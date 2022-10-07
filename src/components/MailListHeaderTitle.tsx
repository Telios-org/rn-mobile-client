import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
import { fonts } from '../util/fonts';
import { colors } from '../util/colors';

const styles = StyleSheet.create({
  statusBadge: {
    width: 10,
    aspectRatio: 1,
    borderRadius: 10,
    marginLeft: 11,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

interface MailListHeaderTitleProps {
  title: string;
  showCurrentStatus?: boolean;
  isActive?: boolean;
  titleStyle?: StyleProp<TextStyle>;
}

export default ({
  title,
  showCurrentStatus,
  isActive,
  titleStyle,
}: MailListHeaderTitleProps) => {
  return (
    <View style={styles.titleContainer}>
      <Text
        style={[{ ...fonts.title2 }, titleStyle]}
        numberOfLines={1}
        ellipsizeMode="tail">
        {title}
      </Text>
      {showCurrentStatus && (
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: isActive ? colors.active : colors.error },
          ]}
        />
      )}
    </View>
  );
};
