import React from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { format, isToday } from 'date-fns';
import { Text, View, Animated } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Button } from '../components/Button';
import {
  InboxStackParams,
  MainStackParams,
  RootStackParams,
} from '../Navigator';
import { spacing } from '../util/spacing';
import { useAppDispatch, useAppSelector } from '../hooks';
import { colors } from '../util/colors';
import { fonts, textStyles } from '../util/fonts';
import { Icon } from '../components/Icon';
import { EmailCell } from '../components/EmailCell';
import { useSelector } from 'react-redux';
import { inboxMailIdsSelector } from '../store/mailSelectors';
import { getNewMailFlow, LocalEmail } from '../store/mail';

export type InboxScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'inbox'>,
  NativeStackScreenProps<RootStackParams>
>;

export const InboxScreen = (props: InboxScreenProps) => {
  const mail = useAppSelector(state => state.mail);
  const dispatch = useAppDispatch();
  const inboxMailIds = useSelector(inboxMailIdsSelector);

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
          <Text style={[fonts.large.bold, { color: textStyles.titleColor }]}>
            {'Inbox'}
          </Text>
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

  const onSelectEmail = (emailId: string) => {
    props.navigation.navigate('inbox', {
      screen: 'emailDetail',
      params: { emailId: emailId },
    });
  };

  const listData = Object.values(mail.mail) as Array<Partial<LocalEmail>>;

  if (listData.length === 0 && !mail.loadingGetMailMeta) {
    listData.push({ _id: 'MAIL_EMPTY' });
  }
  // const listData: Array<LocalEmail> = [];
  // for (let i = 0; i < 50; i++) {
  //   listData.push({
  //     aliasId: '',
  //     attachments: '',
  //     bccJSON: '',
  //     bodyAsHtml: '',
  //     bodyAsText: 'test body goes here wow so much test',
  //     ccJSON: '',
  //     createdAt: '2022-02-16T16:04:11Z',
  //     date: '2022-02-16T16:04:11Z',
  //     emailId: '',
  //     encHeader: '',
  //     encKey: '',
  //     folderId: '',
  //     fromJSON: `[{"name": "Jillian Jacob", "address": "abc123@test.com"}]`,
  //     id: '',
  //     path: '',
  //     size: '',
  //     subject: 'test subject',
  //     toJSON: `[{"name": "Phillip Fry", "address": "abc123@test.com"}]`,
  //     unread: '1',
  //     updatedAt: '2022-02-16T16:04:11Z',
  //     _id: `id${i}`,
  //   });
  // }

  const sectionListData = [
    {
      id: 'MAIL',
      data: listData,
    },
  ];

  const renderItem = ({ item }) => {
    if (item._id === 'MAIL_EMPTY') {
      return <EmptyComponent />;
    } else {
      return (
        <EmailCell email={item} onPress={() => onSelectEmail(item.emailId)} />
      );
    }
  };

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
          {mail.mailbox?.address}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
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
        ListHeaderComponent={renderHeader}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        ListEmptyComponent={EmptyComponent}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          padding: spacing.lg,
        }}>
        <TouchableOpacity
          onPress={onNewEmail}
          style={{
            width: 54,
            height: 54,
            borderRadius: 26,
            backgroundColor: colors.primaryBase,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 4,
            shadowOpacity: 0.2,
            shadowOffset: { width: 2, height: 2 },
          }}>
          <Icon
            name="add-outline"
            size={30}
            color={colors.white}
            style={{ marginRight: -4 }} // + icon is misaligned for some reason
          />
        </TouchableOpacity>
      </View>
    </View>
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
