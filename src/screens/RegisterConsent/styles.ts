import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';
import { spacing } from '../../util/spacing';

export default StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollViewContentContainer: { flexGrow: 1 },
  content: { margin: spacing.lg, flex: 1 },
  headerBackButton: {
    marginLeft: -22,
  },
});
