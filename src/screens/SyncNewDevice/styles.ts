import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../util/spacing';
import { colors } from '../../util/colors';
import { fonts } from '../../util/fonts';

export default StyleSheet.create({
  qrCode: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  codeText: {
    backgroundColor: colors.primaryLightest,
    borderRadius: borderRadius,
    padding: spacing.lg,
    marginVertical: spacing.md,
    alignItems: 'center',
  },
  syncIncetive: {
    ...fonts.regular.regular,
    marginTop: spacing.sm,
  },
  generateQrBtn: { marginTop: spacing.xl },
  generateCodeBtn: { marginTop: spacing.lg },
});
