import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';
import { borderRadius, spacing } from '../../util/spacing';
import { fonts } from '../../util/fonts';

export default StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollViewContent: { margin: spacing.lg },
  namespaceSampleContainer: {
    backgroundColor: colors.skyLighter,
    borderRadius: borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
  },
  namespaceSampleTxt: {
    ...fonts.small.medium,
    color: colors.inkLighter,
  },
  namespaceSampleColor: { color: colors.primaryBase },
  namespaceInput: { marginTop: spacing.xl },
  shuffleButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  wordsAndLettersContainer: { flexDirection: 'row' },
  shuffleWordsBtn: { marginLeft: spacing.sm },
  moreInfoBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.lg,
  },
  warningTxt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  createBtn: { marginTop: spacing.sm },
  moreInfoTxt: {
    ...fonts.regular.medium,
    lineHeight: 22,
    color: colors.skyDark,
    marginBottom: spacing.sm,
  },
  moreInfoBold: {
    fontWeight: 'bold',
  },
  modal: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  moreInfoModalBtn: {
    marginTop: spacing.lg,
  },
});
