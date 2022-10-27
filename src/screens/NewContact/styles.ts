import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';
import { radius, spacing } from '../../util/spacing';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex1: {
    flex: 1,
  },
  button: {
    flex: 1,
    borderRadius: radius.s,
    flexDirection: 'row',
    margin: spacing.md,
  },
});
