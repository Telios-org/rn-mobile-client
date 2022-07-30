import { colors } from '../../util/colors';
import { borderRadius, spacing } from '../../util/spacing';
import { fonts } from '../../util/fonts';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollViewContent: { margin: spacing.lg },
  aliasLongName: {
    backgroundColor: colors.skyLighter,
    borderRadius: borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
  generateButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  wordsAndLettersContainer: { flexDirection: 'row' },
  createBtn: { marginTop: spacing.xxl },
  note: {
    ...fonts.small.regular,
    color: colors.inkLighter,
    marginVertical: 10,
  },
});
