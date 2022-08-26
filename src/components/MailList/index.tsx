import React, { useState, useRef, useLayoutEffect } from 'react';
import { Text, View, Animated } from 'react-native';

import { Button } from '../Button';
import { colors } from '../../util/colors';
import { fonts } from '../../util/fonts';
import { Icon } from '../Icon';
import { EmailCell } from '../EmailCell';

import styles from './styles';
import { Email } from '../../store/types';
import { useNavigation } from '@react-navigation/native';

export type MailListItem = {
  id: string;
  onSelect?: () => void;
  mail?: Email;
};

export type MailListProps = {
  renderNavigationTitle: () => React.ReactNode;
  renderTitleDeps?: any[];
  headerComponent: React.ComponentType<any> | React.ReactElement;
  items: Array<MailListItem>;
  loading?: boolean;
  refreshEnabled?: boolean;
  onRefresh?: () => Promise<void>;
  disableUnreadFilters?: boolean;
  setFilterOption?: (item: FilterOption) => void;
  selectedFilterOption?: FilterOption;
};

export enum FilterOption {
  All = 'All',
  Unread = 'Unread',
  Read = 'Read',
}

export const MailList = ({
  items,
  onRefresh,
  headerComponent,
  renderNavigationTitle,
  renderTitleDeps = [],
  loading,
  disableUnreadFilters,
  setFilterOption,
  selectedFilterOption,
}: MailListProps) => {
  const navigation = useNavigation();
  const headerTitleAnimation = useRef(new Animated.Value(0)).current;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: () => (
        <Animated.View
          style={{
            opacity: headerTitleAnimation.interpolate({
              inputRange: [0, 80, 120],
              outputRange: [0, 0, 1],
            }),
          }}>
          {renderNavigationTitle()}
        </Animated.View>
      ),
    });
  }, renderTitleDeps); // TODO: is this going to cause performance issues?

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onListRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh?.();
    } catch (e) {}
    setIsRefreshing(false);
  };

  const listData = [...items];
  if (listData.length === 0 && !loading) {
    listData.push({ id: 'MAIL_EMPTY' });
  }

  const sectionListData = [
    {
      id: 'MAIL',
      data: listData,
    },
  ];

  const renderItem = ({ item }: { item: MailListItem }) => {
    if (item.id === 'MAIL_EMPTY') {
      return <EmptyComponent />;
    } else {
      return item?.mail ? (
        <EmailCell email={item.mail} onPress={item.onSelect} />
      ) : null;
    }
  };

  const renderFilterHeader = () => {
    if (disableUnreadFilters) {
      return <View style={styles.disableFilterOptions} />;
    }
    return (
      <View style={styles.filterOptionsContainer}>
        {Object.keys(FilterOption)?.map(key =>
          filterOptionsItem(
            FilterOption[key as keyof typeof FilterOption],
            true,
          ),
        )}
      </View>
    );
  };

  const filterMessagesByReadStatus = (optionType: FilterOption) => {
    setFilterOption?.(optionType);
  };

  const filterOptionsItem = (
    optionType: FilterOption,
    firstItem: boolean | undefined = false,
  ) => (
    <Button
      title={optionType}
      key={optionType}
      type="text"
      size="small"
      onPress={() => filterMessagesByReadStatus(optionType)}
      style={
        firstItem ? styles.filterOptionsFirstItem : styles.filterOptionsItem
      }
      titleStyle={
        selectedFilterOption === optionType
          ? styles.filterOptionsItemSelectedText
          : styles.filterOptionsItemUnselectedText
      }
    />
  );

  // @ts-ignore
  const renderSectionHeader = ({ section: { id, data } }) => {
    if (id === 'MAIL') {
      return renderFilterHeader();
    }
    return null;
  };

  return (
    <Animated.SectionList
      style={styles.sectionContainer}
      sections={sectionListData}
      stickySectionHeadersEnabled={true}
      onScroll={Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: {
                y: headerTitleAnimation,
              },
            },
          },
        ],
        { useNativeDriver: true },
      )}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={(item, index) => item.id + index}
      ListHeaderComponent={headerComponent}
      onRefresh={onRefresh ? onListRefresh : null}
      refreshing={isRefreshing}
    />
  );
};

const EmptyComponent = () => (
  <View style={styles.emptyComponentContainer}>
    <Icon name="file-tray-outline" size={50} color={colors.skyLight} />
    <Text style={[fonts.large.regular, { color: colors.skyLight }]}>
      {'No Messages'}
    </Text>
  </View>
);
