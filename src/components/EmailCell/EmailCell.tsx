import React, { memo } from 'react';
import { StyleProp, Text, TextStyle, View } from 'react-native';
import { format, isToday } from 'date-fns';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import { Email } from '../../store/types';
import Avatar from '../Avatar/Avatar';
import { styles } from './styles';
import { SwipeableRow, SwipeableRowProps } from '../SwipeRow/SwipeRow';

export enum ComponentTypes {
  DEFAULT = 'default',
  SEARCH = 'search',
}

export type EmailCellProps = {
  email: Email;
  onPress?: () => void;
  isUnread?: boolean;
} & Pick<SwipeableRowProps, 'rightButtons'>;

type EmailCellPropsWithType = EmailCellProps & { type: ComponentTypes };

const DefaultEmailCell = (props: EmailCellProps) =>
  EmailCellRender({ ...props, type: ComponentTypes.DEFAULT });

const SwipeableEmailCell = (props: EmailCellProps) => {
  const { rightButtons, ...restProps } = props;
  const itemKey = restProps.email.emailId;
  return SwipeableRow({
    children: EmailCellRender({ ...restProps, type: ComponentTypes.DEFAULT }),
    rightButtons,
    itemKey,
  });
};

const SearchEmailCell = (props: EmailCellProps) =>
  EmailCellRender({ ...props, type: ComponentTypes.SEARCH });

const EmailCellRender = ({
  email,
  onPress,
  type,
  isUnread,
}: EmailCellPropsWithType) => {
  let fromName;
  if (email?.fromJSON) {
    const from = JSON.parse(email?.fromJSON);
    fromName = from[0].name;
  }

  const date = new Date(email.date);
  const dateFormatted = format(date, 'LLL do');
  const timeFormatted = format(date, 'p');
  const displayDate = isToday(date) ? timeFormatted : dateFormatted;
  const fontStyles: StyleProp<TextStyle> = {
    fontWeight: isUnread ? 'bold' : '400',
  };

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
      <RectButton activeOpacity={0} onPress={onPress} style={styles.container}>
        <Avatar displayName={fromName} style={styles.avatar} />
        <View style={styles.flex1}>
          <View style={styles.row}>
            <View style={styles.flex1}>
              <Text style={fontStyles}>{fromName}</Text>
            </View>
            <Text style={[styles.date, fontStyles]}>{displayDate}</Text>
          </View>
          <Text style={[styles.subject, fontStyles]}>{email.subject}</Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.bodyText, fontStyles]}>
            {email.bodyAsText?.trim()}
          </Text>
        </View>
      </RectButton>
    );
  }
};

export const EmailCell = Object.assign(DefaultEmailCell, {
  Search: memo(SearchEmailCell),
  Swipeable: SwipeableEmailCell, // TODO use memo, need to refactor EmailCeilRender props
});
