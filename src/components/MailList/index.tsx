import React from 'react';
import { ActivityIndicator, Animated } from 'react-native';
import { EmailCell } from '../EmailCell/EmailCell';

import styles from './styles';
import { Email } from '../../store/types';
import { EmptyComponent } from './components/EmptyComponent';
import { colors } from '../../util/colors';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

export type MailListProps = {
  items: Email[];
  getMoreData: (offset: number, perPage: number) => Promise<Email[]>;
  resetData?: () => void;
  headerComponent?: React.ComponentType<any> | React.ReactElement;
  onItemPress?: (itemId: string, isUnread: boolean) => void;
  headerAnimatedValue?: any;
};

export const MailList = ({
  headerComponent,
  getMoreData,
  items,
  resetData,
  headerAnimatedValue,
  onItemPress,
}: MailListProps) => {
  const { isLoading, flatListProps } = useInfiniteScroll<Email>({
    getData: getMoreData,
    resetData,
    perPage: 10,
  });

  const renderItem = ({ item }: { item: Email }) => (
    <EmailCell
      email={item}
      onPress={() => onItemPress?.(item.emailId, item.unread)}
    />
  );

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
