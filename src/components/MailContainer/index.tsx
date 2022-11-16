import React, { useLayoutEffect } from 'react';
import { View } from 'react-native';
import styles from './styles';
import { MailList } from '../MailList';
import ComposeButton from '../ComposeButton/ComposeButton';
import { Email } from '../../store/types';
import { MailListHeader } from '../MailListHeader';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { SwipeRowProvider } from '../SwipeRow/SwipeRowProvider';

interface MailContainerProps {
  mails: Email[];
  title: string;
  subtitle?: string;
  getMoreData: (offset: number, perPage: number) => Promise<Email[]>;
  resetData?: () => void;
  onPressItem: (id: string) => void;
  onRightActionPress?: (item: Email) => void;
  rightActionTitle?: string;
  showBottomSeparator?: boolean;
  showRecipient?: boolean;
}
export default ({
  mails,
  title,
  subtitle,
  getMoreData,
  resetData,
  onPressItem,
  showBottomSeparator,
  onRightActionPress,
  rightActionTitle,
  showRecipient,
}: MailContainerProps) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

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

  return (
    <SwipeRowProvider isFocusedScreen={isFocused}>
      <View style={styles.mainContainer}>
        <MailListHeader
          title={title}
          subtitle={subtitle}
          showBottomSeparator={showBottomSeparator}
        />
        <View style={styles.listContainer}>
          <MailList
            items={mails}
            getMoreData={getMoreData}
            resetData={resetData}
            showRecipient={showRecipient}
            // headerAnimatedValue={headerTitleAnimation}
            onItemPress={onPressItem}
            onRightActionPress={onRightActionPress}
            rightActionTitle={rightActionTitle}
            highlightItem={false}
          />
        </View>
        <ComposeButton />
      </View>
    </SwipeRowProvider>
  );
};
