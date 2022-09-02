import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';
import { fonts } from '../../util/fonts';
import { spacing } from '../../util/spacing';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: colors.skyLight,
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: spacing.md,
  },
  flex1: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  date: {
    ...fonts.small.regular,
    color: colors.inkLighter,
    maxWidth: 100,
  },
  subject: {
    ...fonts.regular.regular,
    marginTop: 2,
  },
  bodyText: {
    ...fonts.small.regular,
    color: colors.inkLighter,
  },

  searchContainer: {
    paddingLeft: spacing.xl,
    paddingRight: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.skyLighter,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchContent: {},
  searchName: {
    ...fonts.tiny.medium,
  },
  searchSubject: {
    ...fonts.tiny.regular,
    color: colors.inkLighter,
  },
  searchDate: {
    ...fonts.tiny.medium,
    alignSelf: 'center',
  },
});
