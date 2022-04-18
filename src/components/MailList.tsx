import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, View, Animated, StyleProp } from 'react-native';

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
};

export const MailList = ({
  items,
  navigation,
  onRefresh,
  refreshEnabled,
  headerComponent,
  renderNavigationTitle,
  loading,
  disableUnreadFilters,
}: MailListProps) => {
  const headerTitleAnimation = React.useRef(new Animated.Value(0)).current;
  React.useLayoutEffect(() => {
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

  const [isRefreshing, setIsRefreshing] = React.useState(false);

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
      return (
        <View
          style={{
            height: 1,
            backgroundColor: colors.skyLighter,
          }}
        />
      );
    }
    return (
      <View
        style={{
          height: 55,
          borderColor: colors.skyLighter,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.lg,
          backgroundColor: colors.white,
        }}>
        <Button
          title="All"
          type="text"
          size="small"
          onPress={() => {}}
          style={{ paddingRight: spacing.md }}
          titleStyle={{ color: colors.primaryBase }}
        />
        <Button
          title="Unread"
          type="text"
          size="small"
          onPress={() => {}}
          style={{ paddingHorizontal: spacing.md }}
          titleStyle={{ color: colors.skyDark }}
        />
        <Button
          title="Read"
          type="text"
          size="small"
          onPress={() => {}}
          style={{ paddingHorizontal: spacing.md }}
          titleStyle={{ color: colors.skyDark }}
        />
      </View>
    );
  };

  const renderSectionHeader = ({ section: { id, data } }) => {
    if (id === 'MAIL') {
      return renderFilterHeader();
    }
    return null;
  };

  return (
    <Animated.SectionList
      style={{ flex: 1, backgroundColor: colors.white }}
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
  <View
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.xxl,
    }}>
    <Icon name="file-tray-outline" size={50} color={colors.skyLight} />
    <Text style={[fonts.large.regular, { color: colors.skyLight }]}>
      {'No Messages'}
    </Text>
  </View>
);
