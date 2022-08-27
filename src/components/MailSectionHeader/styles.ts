import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';
import { fonts, textStyles } from '../../util/fonts';
import { spacing } from '../../util/spacing';

const MailSectionHeaderStyles = StyleSheet.create({
  text: {
    ...fonts.regular.regular,
    color: textStyles.titleColor,
  },

  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.skyLighter,
  },
  sectionTitle: {
    flex: 1,
  },
  sectionIcon: {
    marginRight: spacing.md,
  },
  sectionCount: {
    alignSelf: 'flex-end',
    fontSize: textStyles.sizes.regular,
    fontWeight: textStyles.weights.medium,
    color: colors.primaryBase,
  },
});

export default MailSectionHeaderStyles;
