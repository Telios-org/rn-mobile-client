import { StyleSheet } from 'react-native';
import { colors } from '../../../../util/colors';
import { fonts } from '../../../../util/fonts';
import { spacing } from '../../../../util/spacing';

export default StyleSheet.create({
  sectionContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.skyBase,
    backgroundColor: colors.white,
    marginTop: spacing.lg,
  },
  headerIcon: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    flex: 5,
  },
  content: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderColor: colors.skyBase,
    backgroundColor: colors.skyLighter,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeader: {
    ...fonts.regular.bold,
  },
  sectionDescription: {
    ...fonts.small.regular,
    marginTop: spacing.xs,
    color: colors.inkLight,
  },
});
