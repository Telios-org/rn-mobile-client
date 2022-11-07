import { StyleSheet } from 'react-native';
import { colors } from '../../../../util/colors';
import { fonts } from '../../../../util/fonts';
import { borderRadius, spacing } from '../../../../util/spacing';

export default StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    ...fonts.regular.bold,
    color: colors.inkLight,
    flex: 1,
  },
  usesTitle: {
    ...fonts.regular.bold,
    color: colors.inkLight,
    flex: 1,
    textAlign: 'right',
  },
  totalLine: {
    height: 12,
    borderRadius: borderRadius,
    backgroundColor: colors.skyLight,
    marginTop: spacing.sm,
  },
  completedLine: {
    height: 12,
    borderRadius: borderRadius,
    backgroundColor: colors.skyDark,
    position: 'absolute',
  },
});
