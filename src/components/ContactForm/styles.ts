import { StyleSheet } from 'react-native';
import { spacing } from '../../util/spacing';
import { colors } from '../../util/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: spacing.md,
  },
  flex1: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  firstItemInRow: {
    flex: 1,
    marginRight: spacing.sm,
  },
});
