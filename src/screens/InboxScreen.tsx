import React, { useEffect, useState } from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { format, isToday } from 'date-fns';

import { FlatList, Text, View, Animated, SectionList } from 'react-native';

import { Button } from '../components/Button';
import { MainStackParams, RootStackParams } from '../Navigator';
import { spacing } from '../util/spacing';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getNewMailFlow, LocalEmail } from '../mainSlice';
import { colors } from '../util/colors';
import { fonts } from '../util/fonts';
import { TouchableOpacity } from 'react-native-gesture-handler';

export type InboxScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'inbox'>,
  NativeStackScreenProps<RootStackParams>
>;

export const InboxScreen = (props: InboxScreenProps) => {
  const mainState = useAppSelector(state => state.main);
  const dispatch = useAppDispatch();

  const headerTitleAnimation = React.useRef(new Animated.Value(0)).current;

  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: () => (
        <Animated.View
          style={{
            opacity: headerTitleAnimation.interpolate({
              inputRange: [0, 80, 120],
              outputRange: [0, 0, 1],
            }),
          }}>
          <Text style={fonts.large.medium}>{'Inbox'}</Text>
        </Animated.View>
      ),
    });
  }, [props.navigation]); // TODO: is this going to cause performance issues?

  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(getNewMailFlow());
    setIsRefreshing(false);
  };

  const onNewEmail = () => {
    props.navigation.navigate('compose');
  };

  // React.useLayoutEffect(() => {
  //   props.navigation.setOptions({
  //     headerRight: () => <TextButton onPress={onRefresh} title="refresh" />,
  //   });
  // }, [props.navigation]);

  // const listData = Object.values(mainState.mail);
  const listData: Array<LocalEmail> = [];
  for (let i = 0; i < 50; i++) {
    listData.push({
      aliasId: '',
      attachments: '',
      bccJSON: '',
      bodyAsHtml: '',
      bodyAsText: 'test body goes here wow so much test',
      ccJSON: '',
      createdAt: '2022-02-16T16:04:11Z',
      date: '2022-02-16T16:04:11Z',
      emailId: '',
      encHeader: '',
      encKey: '',
      folderId: '',
      fromJSON: `[{"name": "Jillian Jacob", "address": "abc123@test.com"}]`,
      id: '',
      path: '',
      size: '',
      subject: 'test subject',
      toJSON: `[{"name": "Phillip Fry", "address": "abc123@test.com"}]`,
      unread: '1',
      updatedAt: '2022-02-16T16:04:11Z',
      _id: `id${i}`,
    });
  }

  const sectionListData = [
    {
      id: 'MAIL',
      data: listData,
    },
  ];

  const renderItem = ({ item }) => <EmailCell email={item} />;

  const renderFilterHeader = () => {
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

  const renderHeader = () => {
    return (
      <View
        style={{
          paddingTop: spacing.md,
          paddingBottom: spacing.lg,
          paddingHorizontal: spacing.md,
        }}>
        <Text style={fonts.title2}>{'Inbox'}</Text>
        <Text style={[fonts.regular.regular, { color: colors.inkLighter }]}>
          {mainState.mailbox?.address}
        </Text>
      </View>
    );
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
      keyExtractor={(item, index) => item._id + index}
      // ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={ItemSeparator}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
    />
  );

  return (
    <>
      <Animated.FlatList
        // onScroll={onScroll}
        // contentContainerStyle={{ paddingTop: containerPaddingTop }}
        // scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
        onScroll={Animated.event(
          // scrollX = e.nativeEvent.contentOffset.x
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
        data={listData}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={ItemSeparator}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
      />
      {/* Wrap your component with `CollapsibleSubHeaderAnimator` */}
      <CollapsibleSubHeaderAnimator translateY={translateY}>
        <MySearchBar />
      </CollapsibleSubHeaderAnimator>
    </>
  );

  return (
    <FlatList
      style={{ flex: 1 }}
      data={listData}
      renderItem={renderItem}
      keyExtractor={item => item._id}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={ItemSeparator}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
    />
  );
};

const ItemSeparator = () => (
  <View style={{ height: 2, backgroundColor: 'yellow' }} />
);

const EmailCell = (props: { email: LocalEmail }) => {
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
      onPress={() => {}}
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
