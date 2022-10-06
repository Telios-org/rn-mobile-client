import { format, isToday } from 'date-fns';
import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Email } from '../../store/types';

import { fonts } from '../../util/fonts';
import { styles } from './styles';

export enum ComponentTypes {
  DEFAULT = 'default',
  SEARCH = 'search',
}

export type EmailCellProps = {
  email: Email;
  onPress?: () => void;
};

type EmailCellPropsWithType = EmailCellProps & { type: ComponentTypes };

const DefaultEmailCell = (props: EmailCellProps) =>
  EmailCellRender({ ...props, type: ComponentTypes.DEFAULT });

const SearchEmailCell = (props: EmailCellProps) =>
  EmailCellRender({ ...props, type: ComponentTypes.SEARCH });

const EmailCellRender = ({ email, onPress, type }: EmailCellPropsWithType) => {
  let fromName;
  if (email?.fromJSON) {
    const from = JSON.parse(email?.fromJSON);
    fromName = from[0].name;
  }
  const isUnread = !!email.unread;

  const date = new Date(email.date);
  const dateFormatted = format(date, 'LLL do');
  const timeFormatted = format(date, 'p');
  const displayDate = isToday(date) ? timeFormatted : dateFormatted;

  if (type === ComponentTypes.SEARCH) {
    return (
      <TouchableOpacity style={styles.searchContainer} onPress={onPress}>
        <View style={styles.searchContent}>
          <Text style={styles.searchName}>{fromName}</Text>
          <Text style={styles.searchSubject}>{email.subject}</Text>
        </View>
        <Text style={styles.searchDate}>{displayDate}</Text>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <View style={styles.avatar} />
        <View style={styles.flex1}>
          <View style={styles.row}>
            <View style={styles.flex1}>
              <Text
                style={isUnread ? fonts.regular.bold : fonts.regular.regular}>
                {fromName}
              </Text>
            </View>
            <Text style={styles.date}>{displayDate}</Text>
          </View>
          <Text style={styles.subject}>{email.subject}</Text>
          <Text numberOfLines={1} style={styles.bodyText}>
            {email.bodyAsText}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
};

export const EmailCell = Object.assign(DefaultEmailCell, {
  Search: memo(SearchEmailCell),
});
