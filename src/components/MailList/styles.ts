import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';
import { spacing } from '../../util/spacing';

export default StyleSheet.create({
  sectionContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },

  filterOptionsContainer: {
    height: 55,
    borderColor: colors.skyLighter,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
  },
  disableFilterOptions: {
    height: 1,
    backgroundColor: colors.skyLighter,
  },
  filterOptionsFirstItem: {
    paddingRight: spacing.md,
  },
  filterOptionsItem: {
    paddingHorizontal: spacing.md,
  },
  filterOptionsItemSelectedText: {
    color: colors.primaryBase,
  },
  filterOptionsItemUnselectedText: {
    color: colors.skyDark,
  },

  emptyComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
});
