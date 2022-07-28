import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';
import { borderRadius, spacing } from '../../util/spacing';
import { fonts } from '../../util/fonts';

export default StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  formikContent: { margin: spacing.lg },
  aliasLongName: {
    backgroundColor: colors.skyLighter,
    borderRadius: borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
  shuffleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  shuffleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shuffleBtnTitle: {
    ...fonts.small.medium,
    color: colors.inkLighter,
    marginLeft: spacing.sm,
  },
  wordsAndLettersContainer: { flexDirection: 'row' },
  shuffleWordsBtn: { marginLeft: spacing.sm },
  description: { marginTop: spacing.md },
  moreInfoBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.lg,
  },
  createBtn: { marginTop: spacing.lg },
  multiSelectInput: { marginTop: spacing.md },
});
