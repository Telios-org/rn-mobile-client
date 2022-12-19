import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';
import { borderRadius, spacing } from '../../util/spacing';

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
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: spacing.sm,
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
