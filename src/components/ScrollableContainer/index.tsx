import React, { PropsWithChildren } from 'react';
import styles from './styles';
import {
  ScrollView,
  ScrollViewProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

interface ScrollableContainerProps {
  scrollView?: ScrollViewProps;
  contentContainer?: StyleProp<ViewStyle>;
}

export default ({
  children,
  scrollView,
}: PropsWithChildren<ScrollableContainerProps>) => {
  const headerHeight = useHeaderHeight();

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        { marginTop: headerHeight },
        styles.scrollViewContainer,
      ]}
      {...scrollView}>
      <View style={styles.content}>{children}</View>
    </ScrollView>
  );
};
