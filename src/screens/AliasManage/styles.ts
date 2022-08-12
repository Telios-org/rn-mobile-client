import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';
import { spacing } from '../../util/spacing';
import { fonts } from '../../util/fonts';

export default StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollViewContent: {
    margin: spacing.lg,
  },
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  emptyAliasesContainer: {
    alignItems: 'center',
    marginVertical: spacing.xxl,
  },
  note: {
    ...fonts.small.regular,
    color: colors.inkLighter,
    marginTop: 10,
  },
});
