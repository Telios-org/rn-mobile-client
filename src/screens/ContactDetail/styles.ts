import { StyleSheet } from 'react-native';

import { radius, spacing } from '../../util/spacing';
import { colors } from '../../util/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex1: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  actionButtons: {
    marginVertical: spacing.lg,
    margin: spacing.md,
  },
  cancelButton: {
    marginRight: spacing.md,
  },
  deteleButton: {
    borderColor: colors.error,
  },
  deteleText: {
    color: colors.error,
  },
  button: {
    flex: 1,
    borderRadius: radius.s,
  },
});
