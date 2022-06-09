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
    flexGrow: 1,
  },
  content: {
    margin: spacing.lg,
    flex: 1,
  },
  timeCrack: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeCrackText: {
    ...fonts.regular.regular,
    flex: 1,
    marginRight: spacing.sm,
    color: colors.inkLighter,
  },
  strength: {
    backgroundColor: colors.success,
    borderRadius: 30,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  whatsThis: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
  nextBtnContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  modalContainer: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
});
