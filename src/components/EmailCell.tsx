import { format, isToday } from 'date-fns';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LocalEmail } from '../store/mail';
import { colors } from '../util/colors';
import { fonts } from '../util/fonts';
import { spacing } from '../util/spacing';

export type EmailCellProps = {
  email: LocalEmail;
  onPress?: () => void;
};
export const EmailCell = (props: EmailCellProps) => {
  let fromName;
  let fromEmail;
  if (props.email?.fromJSON) {
    const from = JSON.parse(props.email?.fromJSON);
    fromName = from[0].name;
    fromEmail = from[0].address;
  }
  const isUnread = !!props.email.unread;

  const date = new Date(props.email.date);
  const dateFormatted = format(date, 'LLL do');
  const timeFormatted = format(date, 'p');
  const displayDate = isToday(date) ? timeFormatted : dateFormatted;
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View
        style={{
          backgroundColor: colors.skyLight,
          width: 50,
          height: 50,
          borderRadius: 25,
        }}
      />
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Text style={fonts.regular.bold}>{fromName}</Text>
          </View>
          <Text
            style={[
              fonts.small.regular,
              { color: colors.inkLighter, maxWidth: 100 },
            ]}>
            {displayDate}
          </Text>
        </View>
        <Text style={[fonts.regular.regular, { marginTop: 2 }]}>
          {props.email.subject}
        </Text>
        <Text
          numberOfLines={1}
          style={[fonts.small.regular, { color: colors.inkLighter }]}>
          {props.email.bodyAsText}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
