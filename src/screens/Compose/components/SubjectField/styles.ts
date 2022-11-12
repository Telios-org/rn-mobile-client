import { StyleSheet } from 'react-native';
import { spacing } from '../../../../util/spacing';
import { colors } from '../../../../util/colors';
import { textStyles } from '../../../../util/fonts';

export default StyleSheet.create({
  container: {
    minHeight: 50,
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomColor: colors.skyLight,
    borderBottomWidth: 1,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  textInput: {
    paddingHorizontal: spacing.sm,
    height: '100%',
    flex: 1,
    color: textStyles.defaultColor,
    fontSize: textStyles.sizes.regular,
  },
});
