import { StyleSheet } from 'react-native';

import { spacing, borderRadius } from '../../../util/spacing';
import { fonts, textStyles } from '../../../util/fonts';
import { colors } from '../../../util/colors';

export default StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
  },
  title: {
    ...fonts.title3,
    fontWeight: textStyles.weights.semiBold,
  },
  description: {
    ...fonts.regular.regular,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingTop: spacing.lg,
    alignItems: 'center',
  },
  textInputContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  textInput: {
    borderWidth: 1,
  },
  actionButton: {
    width: 55,
    height: 55,
    borderWidth: 1,
    borderColor: colors.skyBase,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius,
    paddingLeft: spacing.xs,
  },
});
