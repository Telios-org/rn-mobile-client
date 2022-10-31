import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../util/spacing';
import { colors } from '../../../util/colors';
import { fonts } from '../../../util/fonts';

export default StyleSheet.create({
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.skyLighter,
    paddingVertical: spacing.md,
    minHeight: 55,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    borderColor: colors.skyBase,
    borderRadius: borderRadius,
    ...fonts.regular.regular,
  },
  divider: {
    marginTop: spacing.lg,
  },
  value: {
    flex: 1,
    ...fonts.small.regular,
  },
  copyIcon: {
    paddingLeft: spacing.xs,
  },
  row: {
    flexDirection: 'row',
  },
});
