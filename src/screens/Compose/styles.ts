import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';
import { spacing } from '../../util/spacing';

export default StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.white,
  },
  rowContainer: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomColor: colors.skyLight,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
