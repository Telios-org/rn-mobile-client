import { useAppDispatch, useAppSelector } from '../../hooks';
import { FoldersId } from '../../store/types/enums/Folders';
import React, { useLayoutEffect, useState } from 'react';
import MailFilters, {
  FilterOption,
  FilterType,
} from '../MailList/components/MailFilters';
import { resetMailsByFolder } from '../../store/emails';
import { View } from 'react-native';
import styles from './styles';
import { MailList } from '../MailList';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Email } from '../../store/types';
import { RootState } from '../../store';
import { moveMailToTrash } from '../../store/thunks/email';
import { decrementFolderCounter } from '../../store/thunks/folders';
import { SwipeRowProvider } from '../SwipeRow/SwipeRowProvider';

interface MailWithFiltersContainerProps {
  folderId: FoldersId;
  renderTitle: React.ReactElement;
  allMailSelector: (state: RootState) => Email[];
  readMailSelector: (state: RootState) => Email[];
  unreadMailSelector: (state: RootState) => Email[];
  getAllMails: (offset: number, perPage: number) => Promise<Email[]>;
  getReadMails: (offset: number, perPage: number) => Promise<Email[]>;
  getUnreadMails: (offset: number, perPage: number) => Promise<Email[]>;
}

export default ({
  renderTitle,
  folderId,
  allMailSelector,
  unreadMailSelector,
  readMailSelector,
  getAllMails,
  getUnreadMails,
  getReadMails,
}: MailWithFiltersContainerProps) => {
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const allMails = useAppSelector(allMailSelector);
  const readMails = useAppSelector(readMailSelector);
  const unreadMails = useAppSelector(unreadMailSelector);
  // const headerTitleAnimation = useRef(new Animated.Value(0)).current;

  const [selectedFilterOption, setSelectedFilterOption] =
    useState<FilterOption>(FilterOption.All);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      // headerTitle: () => (
      //   <Animated.View
      //     style={{
      //       opacity: headerTitleAnimation.interpolate({
      //         inputRange: [0, 80, 120],
      //         outputRange: [0, 0, 1],
      //       }),
      //     }}>
      //     <NavTitle>{'Inbox'}</NavTitle>
      //   </Animated.View>
      // ),
    });
  }, []);

  const onSelectEmail = (emailId: string, isUnread: boolean) => {
    navigation.navigate('emailDetail', { emailId: emailId, isUnread });
  };

  const onDeleteEmail = async (item: Email) => {
    await dispatch(moveMailToTrash({ messages: [item] }));
    await dispatch(decrementFolderCounter({ email: item }));
  };

  const resetData = (filter: FilterType) => () => {
    dispatch(
      resetMailsByFolder({
        folderId,
        filter,
      }),
    );
  };

  const renderHeader = (
    <>
      {renderTitle}
      <MailFilters
        selectedFilter={selectedFilterOption}
        onSelectFilter={filter =>
          setSelectedFilterOption(filter as FilterOption)
        }
      />
    </>
  );

  return (
    <SwipeRowProvider
      isFocusedScreen={isFocused}
      focusTabDep={selectedFilterOption}>
      <View style={styles.mainContainer}>
        {renderHeader}
        <View
          style={[
            styles.tabView,
            selectedFilterOption !== FilterOption.All && styles.tabViewHide,
          ]}>
          <MailList
            items={allMails}
            getMoreData={getAllMails}
            resetData={resetData('all')}
            // headerAnimatedValue={headerTitleAnimation}
            onItemPress={onSelectEmail}
            onRightActionPress={onDeleteEmail}
          />
        </View>
        <View
          style={[
            styles.tabView,
            selectedFilterOption !== FilterOption.Unread && styles.tabViewHide,
          ]}>
          <MailList
            items={unreadMails}
            getMoreData={getUnreadMails}
            resetData={resetData('unread')}
            // headerAnimatedValue={headerTitleAnimation}
            onItemPress={onSelectEmail}
            onRightActionPress={onDeleteEmail}
          />
        </View>
        <View
          style={[
            styles.tabView,
            selectedFilterOption !== FilterOption.Read && styles.tabViewHide,
          ]}>
          <MailList
            items={readMails}
            getMoreData={getReadMails}
            resetData={resetData('read')}
            // headerAnimatedValue={headerTitleAnimation}
            onItemPress={onSelectEmail}
            onRightActionPress={onDeleteEmail}
          />
        </View>
      </View>
    </SwipeRowProvider>
  );
};
