import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
import images from '../../assets/images';

interface Props {
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}

export default ({ style, onPress }: Props) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const onPressWrapper = async () => {
    setIsRefreshing(true);
    try {
      await onPress();
    } catch {}
    setIsRefreshing(false);
  };
  const startSpin = () => {
    spinValue.setValue(0);
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.inOut(Easing.linear),
        useNativeDriver: true,
      }),
    ).start();
  };

  const stopSpin = () => {
    spinValue.stopAnimation();
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (isRefreshing) {
      startSpin();
    } else {
      stopSpin();
    }
  }, [isRefreshing]);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Pressable disabled={isRefreshing} onPress={onPressWrapper} style={style}>
      <Animated.Image
        source={images.refresh}
        resizeMode={'contain'}
        style={{ width: 20, height: 24, transform: [{ rotate }] }}
      />
    </Pressable>
  );
};
