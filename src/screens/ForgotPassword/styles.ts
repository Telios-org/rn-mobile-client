import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';
import { spacing } from '../../util/spacing';
import { fonts } from '../../util/fonts';

export default StyleSheet.create({
  container: {
    margin: spacing.lg,
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollViewContainer: { flexGrow: 1 },
  resetText: {
    ...fonts.regular.regular,
    marginTop: spacing.sm,
  },
  input: {
    marginTop: spacing.xxl,
  },
  textInput: {
    height: 143,
  },
  nextBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  infoBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
  keyboardAvoidingView: { flex: 1 },
});
