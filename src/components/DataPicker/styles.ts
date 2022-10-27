import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';

import { borderRadius, spacing } from '../../util/spacing';
import { fonts } from '../../util/fonts';

export default StyleSheet.create({
  textInputContainer: {
    marginBottom: spacing.md,
  },
  textInput: {
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    minHeight: 55,
    borderColor: colors.skyBase,
    borderRadius: borderRadius,
    ...fonts.regular.regular,
  },
  editText: {
    ...fonts.regular.regular,
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
