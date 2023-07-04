import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';
import { fonts } from '../../util/fonts';
import { spacing } from '../../util/spacing';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
  settingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderColor: colors.skyBase,
  },
  settingText: {
    ...fonts.large.bold,
  },
  description: {
    ...fonts.tiny.regular,
    marginTop: spacing.md,
  },
  errorText: {
    ...fonts.tiny.regular,
    color: colors.error,
  },
});
