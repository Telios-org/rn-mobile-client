import React, {
  useRef,
  useContext,
  useCallback,
  useEffect,
  PropsWithChildren,
} from 'react';
import { Animated, Text, View, ViewStyle } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { SwipeRowContext } from './SwipeRowProvider';
import styles from './styles';

interface SwipeRowActionsProps {
  title: string;
  width: number;
  onPress?: () => void;
  background?: ViewStyle['backgroundColor'];
}

export interface SwipeableRowProps {
  rightButtons?: SwipeRowActionsProps[];
  itemKey: string;
}

export const SwipeableRow = ({
  children,
  rightButtons = [],
  itemKey,
}: PropsWithChildren<SwipeableRowProps>) => {
  const swipeableRef = useRef<Swipeable>(null);
  const { openedItemKey, setOpenedItemKey, isFocused, focusTabDep } =
    useContext(SwipeRowContext);

  const close = () => {
    swipeableRef.current?.close();
  };

  const handleSwipe = () => {
    setOpenedItemKey(itemKey);
  };

  useEffect(() => {
    if (openedItemKey && itemKey !== openedItemKey) {
      close();
    }
  }, [itemKey, openedItemKey]);

  useEffect(() => {
    close();
  }, [isFocused, focusTabDep]);

  const renderButtons = useCallback(
    (buttons: SwipeRowActionsProps[], progress) => {
      return (
        <View
          style={{
            width: 64 * buttons.length,
            flexDirection: 'row',
          }}>
          {buttons.map(({ title, background, width, onPress }) => {
            const trans = progress.interpolate({
              inputRange: [0, 1],
              outputRange: [width, 0],
            });
            const pressHandler = () => {
              close();
              onPress?.();
            };
            return (
              <Animated.View
                key={title}
                style={{
                  flex: 1,
                  transform: [{ translateX: trans }],
                }}>
                <RectButton
                  style={[styles.rightAction, { backgroundColor: background }]}
                  onPress={pressHandler}>
                  <Text style={styles.actionText}>{title}</Text>
                </RectButton>
              </Animated.View>
            );
          })}
        </View>
      );
    },
    [],
  );

  const renderRightButtons = useCallback(
    progress => {
      return renderButtons(rightButtons, progress);
    },
    [rightButtons],
  );

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      rightThreshold={40}
      onSwipeableWillOpen={handleSwipe}
      overshootRight={false}
      renderRightActions={renderRightButtons}>
      {children}
    </Swipeable>
  );
};
