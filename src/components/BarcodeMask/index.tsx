import React from 'react';
import { Dimensions } from 'react-native';
import { Svg, Defs, Rect, Mask } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const maksWidth = width - 34;

export default () => {
  return (
    <Svg height="100%" width="100%">
      <Defs>
        <Mask id="mask" x="0" y="0" height="100%" width="100%">
          <Rect height="100%" width="100%" fill="rgba(255, 255, 255, 0.4)" />
          <Rect
            x={16}
            y={height / 2 - maksWidth / 2}
            height={maksWidth}
            width={maksWidth}
            rx="14"
            ry="14"
            fill="black"
            strokeWidth={2}
            stroke="white"
          />
        </Mask>
      </Defs>
      <Rect
        height="100%"
        width="100%"
        fill="rgba(255, 255, 255, 0.5)"
        mask="url(#mask)"
        fill-opacity="0"
      />
    </Svg>
  );
};
