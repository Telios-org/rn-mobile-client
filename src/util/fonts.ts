import { TextStyle } from 'react-native';
import { colors } from './colors';

export const textStyles = {
  weights: {
    extraBold: '800' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
    semiBold: '600' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    regular: '400' as TextStyle['fontWeight'],
    light: '300' as TextStyle['fontWeight'],
    extraLight: '200' as TextStyle['fontWeight'],
  },
  sizes: {
    title1: 48,
    title2: 32,
    title3: 24,
    large: 18,
    regular: 16,
    small: 14,
    tiny: 12,
  },
  defaultColor: colors.inkBase,
};

export const fonts = {
  title1: {
    fontWeight: textStyles.weights.bold,
    fontSize: textStyles.sizes.title1,
    color: textStyles.defaultColor,
  },
  title2: {
    fontWeight: textStyles.weights.bold,
    fontSize: textStyles.sizes.title2,
    color: textStyles.defaultColor,
  },
  title3: {
    fontWeight: textStyles.weights.bold,
    fontSize: textStyles.sizes.title3,
    color: textStyles.defaultColor,
  },
  large: {
    bold: {
      fontWeight: textStyles.weights.bold,
      fontSize: textStyles.sizes.large,
      color: textStyles.defaultColor,
    },
    medium: {
      fontWeight: textStyles.weights.medium,
      fontSize: textStyles.sizes.large,
      color: textStyles.defaultColor,
    },
    regular: {
      fontWeight: textStyles.weights.regular,
      fontSize: textStyles.sizes.large,
      color: textStyles.defaultColor,
    },
  },
  regular: {
    bold: {
      fontWeight: textStyles.weights.bold,
      fontSize: textStyles.sizes.regular,
      color: textStyles.defaultColor,
    },
    medium: {
      fontWeight: textStyles.weights.medium,
      fontSize: textStyles.sizes.regular,
      color: textStyles.defaultColor,
    },
    regular: {
      fontWeight: textStyles.weights.regular,
      fontSize: textStyles.sizes.regular,
      color: textStyles.defaultColor,
    },
  },
  small: {
    bold: {
      fontWeight: textStyles.weights.bold,
      fontSize: textStyles.sizes.small,
      color: textStyles.defaultColor,
    },
    medium: {
      fontWeight: textStyles.weights.medium,
      fontSize: textStyles.sizes.small,
      color: textStyles.defaultColor,
    },
    regular: {
      fontWeight: textStyles.weights.regular,
      fontSize: textStyles.sizes.small,
      color: textStyles.defaultColor,
    },
  },
  tiny: {
    bold: {
      fontWeight: textStyles.weights.bold,
      fontSize: textStyles.sizes.tiny,
      color: textStyles.defaultColor,
    },
    medium: {
      fontWeight: textStyles.weights.medium,
      fontSize: textStyles.sizes.tiny,
      color: textStyles.defaultColor,
    },
    regular: {
      fontWeight: textStyles.weights.regular,
      fontSize: textStyles.sizes.tiny,
      color: textStyles.defaultColor,
    },
  },
};
