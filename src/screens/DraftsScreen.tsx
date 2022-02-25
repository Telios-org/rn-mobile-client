import React from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Animated, Text, View } from 'react-native';
import { MainStackParams, RootStackParams } from '../Navigator';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getMailByFolder, LocalEmail } from '../mainSlice';
import { fonts, textStyles } from '../util/fonts';
import { colors } from '../util/colors';
import { Button } from '../components/Button';
import { spacing } from '../util/spacing';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from '../components/Icon';
import { EmailCell } from '../components/EmailCell';
import { useSelector } from 'react-redux';
import { draftsMailIdsSelector } from '../util/selectors';

export type DraftsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'drafts'>,
  NativeStackScreenProps<RootStackParams>
>;

// export const DraftsScreen = (props: DraftsScreenProps) => {
//   const mainState = useAppSelector(state => state.main);
//   const dispatch = useAppDispatch();

//   React.useLayoutEffect(() => {
//     console.log('drafts screen useLayoutEffect');
//     const draftsFolder = mainState.folders?.find(
//       a => a.name?.toLowerCase() === 'drafts',
//     );
//     if (draftsFolder?._id) {
//       dispatch(getMailByFolder({ id: draftsFolder._id }));
//     }
//   }, []);

//   return <View style={{ flex: 1 }}></View>;
// };

export const DraftsScreen = (props: DraftsScreenProps) => {
  const mainState = useAppSelector(state => state.main);
  const dispatch = useAppDispatch();
  const draftMailIds = useSelector(draftsMailIdsSelector);

  const headerTitleAnimation = React.useRef(new Animated.Value(0)).current;

  React.useLayoutEffect(() => {
    console.log('drafts screen useLayoutEffect');
    const draftsFolder = mainState.folders?.find(
      a => a.name?.toLowerCase() === 'drafts',
    );
    if (draftsFolder?._id) {
      dispatch(getMailByFolder({ id: draftsFolder._id }));
    }
  }, []);

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
            {'Drafts'}
          </Text>
        </Animated.View>
      ),
    });
  }, [props.navigation]); // TODO: is this going to cause performance issues?

  // const listData = draftMailIds.map(mailId => mainState.mail[mailId]) as Array<
  //   Partial<LocalEmail>
  // >;
  const listData = Object.values(mainState.mail) as Array<Partial<LocalEmail>>;
  if (listData.length === 0 && !mainState.loadingGetMailMeta) {
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
      return <EmailCell email={item} />;
    }
  };

  const renderHeader = () => {
    return (
      <View
        style={{
          paddingTop: spacing.md,
          paddingBottom: spacing.lg,
          paddingHorizontal: spacing.md,
        }}>
        <Text style={fonts.title2}>{'Drafts'}</Text>
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
        keyExtractor={(item, index) => item._id + index}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={EmptyComponent}
      />
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
      {'No Drafts'}
    </Text>
  </View>
);
