import React, { useState, useRef, useLayoutEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, View, Animated, StyleSheet } from 'react-native';

import { Button } from '../components/Button';
import { spacing } from '../util/spacing';
import { colors } from '../util/colors';
import { fonts } from '../util/fonts';
import { Icon } from '../components/Icon';
import { EmailCell } from '../components/EmailCell';
import { LocalEmail } from '../store/mail';

export type MailListItem = {
  id: string;
  onSelect?: () => void;
  mail?: LocalEmail;
};

export type MailListProps = {
  navigation: NativeStackNavigationProp<any>;
  renderNavigationTitle: () => React.ReactNode;
  headerComponent: React.ComponentType<any> | React.ReactElement;
  items: Array<MailListItem>;
  loading?: boolean;
  refreshEnabled?: boolean;
  onRefresh?: () => Promise<void>;
  disableUnreadFilters?: boolean;
  filterListItems?: (item: object) => void;
};

export enum FilterOption {
  All = 'All',
  Unread = 'Unread',
  Read = 'Read',
}

export const MailList = ({
  items,
  navigation,
  onRefresh,
  refreshEnabled,
  headerComponent,
  renderNavigationTitle,
  loading,
  disableUnreadFilters,
  filterListItems,
}: MailListProps) => {
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
  }, [navigation]); // TODO: is this going to cause performance issues?

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilterOption, setSelectedFilterOption] =
    useState<FilterOption>(FilterOption.All);

  const onListRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (e) {
      setIsRefreshing(false);
    }
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
      return <EmailCell email={item.mail} onPress={item.onSelect} />;
    }
  };

  // TODO: hook these up
  const renderFilterHeader = () => {
    if (disableUnreadFilters) {
      return <View style={styles.disableFilterOptions} />;
    }
    return (
      <View style={styles.filterOptionsContainer}>
        {Object.keys(FilterOption)?.map(key =>
          filterOptionsItem(FilterOption[key], true),
        )}
      </View>
    );
  };

  const filterMessagesByReadStatus = (optionType: FilterOption) => {
    filterListItems?.({ readStatus: optionType });
    setSelectedFilterOption(optionType);
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

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },

  filterOptionsContainer: {
    height: 55,
    borderColor: colors.skyLighter,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
  },
  disableFilterOptions: {
    height: 1,
    backgroundColor: colors.skyLighter,
  },
  filterOptionsFirstItem: {
    paddingRight: spacing.md,
  },
  filterOptionsItem: {
    paddingHorizontal: spacing.md,
  },
  filterOptionsItemSelectedText: {
    color: colors.primaryBase,
  },
  filterOptionsItemUnselectedText: {
    color: colors.skyDark,
  },

  emptyComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
});
