import { StyleSheet } from 'react-native';
import { fonts, textStyles } from '../../../../util/fonts';
import { colors } from '../../../../util/colors';
import { spacing } from '../../../../util/spacing';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  prefix: {
    ...fonts.regular.medium,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    color: textStyles.defaultColor,
    fontSize: textStyles.sizes.regular,
  },

  invalidEmail: {
    borderWidth: 1,
    borderColor: colors.error,
  },
  flexDirectionRow: { flexDirection: 'row' },
  actionBtnSpacing: { marginRight: 10 },
});
