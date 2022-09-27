import React, { useLayoutEffect } from 'react';
import { View } from 'react-native';
import styles from './styles';
import { MailList } from '../MailList';
import ComposeButton from '../ComposeButton/ComposeButton';
import { Email } from '../../store/types';
import { MailListHeader } from '../MailListHeader';
import { useNavigation } from '@react-navigation/native';

interface MailContainerProps {
  mails: Email[];
  title: string;
  subtitle?: string;
  getMoreData: (offset: number, perPage: number) => Promise<Email[]>;
  resetData?: () => void;
  onPressItem: (id: string) => void;
  showBottomSeparator?: boolean;
}
export default ({
  mails,
  title,
  subtitle,
  getMoreData,
  resetData,
  onPressItem,
  showBottomSeparator,
}: MailContainerProps) => {
  const navigation = useNavigation();

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
          // headerAnimatedValue={headerTitleAnimation}
          onItemPress={onPressItem}
        />
      </View>
      <ComposeButton />
    </View>
  );
};
