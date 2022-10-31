import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';
import { spacing } from '../../util/spacing';

export default StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  content: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.skyBase,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    marginTop: spacing.lg,
  },
});
