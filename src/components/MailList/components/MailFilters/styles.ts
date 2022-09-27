import { StyleSheet } from 'react-native';
import { colors } from '../../../../util/colors';
import { spacing } from '../../../../util/spacing';

export default StyleSheet.create({
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
  filterOptionsItem: {
    paddingRight: spacing.md,
  },
  filterOptionsItemSelectedText: {
    color: colors.primaryBase,
  },
  filterOptionsItemUnselectedText: {
    color: colors.skyDark,
  },
});
