import { StyleSheet } from 'react-native';
import { spacing } from '../../util/spacing';
import { fonts } from '../../util/fonts';

export default StyleSheet.create({
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
