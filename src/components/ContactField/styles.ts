import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';

import { spacing } from '../../util/spacing';
import { fonts } from '../../util/fonts';

export default StyleSheet.create({
  textInputContainer: {
    marginBottom: spacing.md,
  },
  textInput: {
    borderWidth: 1,
  },
  text: {
    ...fonts.regular.medium,
    minHeight: 55,
  },
  label: {
    color: colors.inkLight,
  },
  flex1: {
    flex: 1,
  },
  pressableArea: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    height: '100%',
  },
});
