import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../util/spacing';

export default StyleSheet.create({
  button: {
    paddingHorizontal: spacing.sm,
  },
  buttonContent: {
    flexDirection: 'row',
    height: 45,
    borderRadius: borderRadius,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  leftIconContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  buttonTitle: { flex: 1 },
  rightIconContainer: {
    width: 45,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  rightTextMargin: { marginLeft: 5 },
});
