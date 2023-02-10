import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';
import { borderRadius, spacing } from '../../util/spacing';
import { fonts } from '../../util/fonts';

export default StyleSheet.create({
  countryLabel: {
    color: colors.inkLight,
  },
  countryBtn: {
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    marginBottom: spacing.md,
    minHeight: 55,
    borderColor: colors.skyBase,
    borderRadius: borderRadius,
    ...fonts.regular.regular,
  },
  countryBtnText: {
    ...fonts.regular.bold,
    color: 'red',
  },
});
