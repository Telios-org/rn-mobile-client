import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';
import { fonts } from '../../util/fonts';
import { spacing } from '../../util/spacing';

export default StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  sectionContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.skyBase,
    backgroundColor: colors.white,
    marginTop: spacing.lg,
  },
  content: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
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
  sectionHeaderTitle: {
    marginLeft: spacing.md,
    marginRight: spacing.md,
  },
  sectionHeader: {
    ...fonts.regular.bold,
  },
  usesTitle: {
    ...fonts.regular.bold,
    color: colors.inkLight,
  },
  sectionDescription: {
    ...fonts.small.regular,
    marginTop: spacing.xs,
    color: colors.inkLight,
  },
  logo: {
    height: 34,
    width: 34,
  },
  hashtagText: {
    color: colors.secondaryBase,
    fontSize: 36,
    fontWeight: '500',
  },
});
