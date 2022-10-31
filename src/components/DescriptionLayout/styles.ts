import { StyleSheet } from 'react-native';
import { spacing } from '../../util/spacing';
import { colors } from '../../util/colors';
import { fonts } from '../../util/fonts';

export default StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...fonts.title3,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  sectionDescription: {
    ...fonts.regular.regular,
    color: colors.inkLighter,
  },
});
