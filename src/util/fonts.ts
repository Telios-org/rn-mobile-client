import { TextStyle } from 'react-native';

export const textStyles: {
  weights: { [key: string]: TextStyle['fontWeight'] };
  sizes: { [key: string]: number };
} = {
  weights: {
    extraBold: '800',
    bold: '700',
    semiBold: '600',
    medium: '500',
    regular: '400',
    light: '300',
    extraLight: '200',
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
};

export const fonts = {
  title1: {
    fontWeight: textStyles.weights.bold,
    fontSize: textStyles.sizes.title1,
  },
  title2: {
    fontWeight: textStyles.weights.bold,
    fontSize: textStyles.sizes.title2,
  },
  title3: {
    fontWeight: textStyles.weights.bold,
    fontSize: textStyles.sizes.title3,
  },
  large: {
    bold: {
      fontWeight: textStyles.weights.bold,
      fontSize: textStyles.sizes.large,
    },
    medium: {
      fontWeight: textStyles.weights.medium,
      fontSize: textStyles.sizes.large,
    },
    regular: {
      fontWeight: textStyles.weights.regular,
      fontSize: textStyles.sizes.large,
    },
  },
  regular: {
    bold: {
      fontWeight: textStyles.weights.bold,
      fontSize: textStyles.sizes.regular,
    },
    medium: {
      fontWeight: textStyles.weights.medium,
      fontSize: textStyles.sizes.regular,
    },
    regular: {
      fontWeight: textStyles.weights.regular,
      fontSize: textStyles.sizes.regular,
    },
  },
  small: {
    bold: {
      fontWeight: textStyles.weights.bold,
      fontSize: textStyles.sizes.small,
    },
    medium: {
      fontWeight: textStyles.weights.medium,
      fontSize: textStyles.sizes.small,
    },
    regular: {
      fontWeight: textStyles.weights.regular,
      fontSize: textStyles.sizes.small,
    },
  },
  tiny: {
    bold: {
      fontWeight: textStyles.weights.bold,
      fontSize: textStyles.sizes.tiny,
    },
    medium: {
      fontWeight: textStyles.weights.medium,
      fontSize: textStyles.sizes.tiny,
    },
    regular: {
      fontWeight: textStyles.weights.regular,
      fontSize: textStyles.sizes.tiny,
    },
  },
};
