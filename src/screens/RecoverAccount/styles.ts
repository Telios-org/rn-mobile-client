import { StyleSheet } from 'react-native';
import { spacing } from '../../util/spacing';

export default StyleSheet.create({
  inputContainer: {
    marginTop: spacing.xl,
  },
  textInput: {
    paddingRight: 125, // this is not ok, need input refactor
  },
  emailPostfix: {
    height: '100%',
    justifyContent: 'center',
  },
});
