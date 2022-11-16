import React from 'react';
import { ActivityIndicator, Animated } from 'react-native';
import { EmailCell } from '../EmailCell/EmailCell';

import styles from './styles';
import { Email, ToFrom } from '../../store/types';
import { EmptyComponent } from './components/EmptyComponent';
import { colors } from '../../util/colors';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

export type MailListProps = {
  items: Email[];
  getMoreData: (offset: number, perPage: number) => Promise<Email[]>;
  resetData?: () => void;
  headerComponent?: React.ComponentType<any> | React.ReactElement;
  onItemPress?: (itemId: string, isUnread: boolean) => void;
  onRightActionPress?: (itemId: Email) => void;
  rightActionTitle?: string;
  headerAnimatedValue?: any;
  highlightItem?: boolean;
  showRecipient?: boolean;
};

export const MailList = ({
  headerComponent,
  getMoreData,
  items,
  resetData,
  headerAnimatedValue,
  onItemPress,
  onRightActionPress,
  rightActionTitle,
  showRecipient,
  highlightItem = true,
}: MailListProps) => {
  const { isLoading, flatListProps } = useInfiniteScroll<Email>({
    getData: getMoreData,
    resetData,
    perPage: 10,
  });

  const renderItem = ({ item }: { item: Email }) => {
    const fromJSON: ToFrom = JSON.parse(item.fromJSON)[0];
    let toJSON: ToFrom | undefined;
    if (showRecipient) {
      toJSON = JSON.parse(item.toJSON)[0];
    }
    const recipient = toJSON || fromJSON;
    return (
      <EmailCell.Swipeable
        emailId={item.emailId}
        emailDate={item.date}
        bodyAsText={item.bodyAsText}
        subject={item.subject}
        recipient={recipient.name || recipient.address}
        onPress={() => onItemPress?.(item.emailId, item.unread)}
        rightButtons={[
          {
            title: rightActionTitle || 'Delete',
            onPress: () => onRightActionPress?.(item),
            width: 64,
            background: colors.error,
          },
        ]}
        isUnread={item.unread && highlightItem}
      />
    );
  };

  return (
    <Animated.FlatList
      style={styles.sectionContainer}
      data={items}
      // onScroll={Animated.event(
      //   [
      //     {
      //       nativeEvent: {
      //         contentOffset: {
      //           y: headerAnimatedValue,
      //         },
      //       },
      //     },
      //   ],
      //   { useNativeDriver: true },
      // )}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
      ListEmptyComponent={
        !isLoading && items.length === 0 ? EmptyComponent : null
      }
      keyExtractor={item => item.emailId}
      ListHeaderComponent={headerComponent}
      ListFooterComponent={
        isLoading && items.length > 0 ? (
          <ActivityIndicator color={colors.primaryBase} />
        ) : null
      }
      {...flatListProps}
    />
  );
};
