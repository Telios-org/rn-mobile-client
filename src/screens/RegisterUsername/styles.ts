import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';
import { spacing } from '../../util/spacing';

export default StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollViewContentContainer: { flexGrow: 1 },
  content: { margin: spacing.lg, flex: 1 },
  inputContainer: { flexDirection: 'row', marginTop: spacing.lg },
  textInputStyle: { paddingRight: 100 },
  nextBtn: {
    right: spacing.lg,
    bottom: spacing.lg,
  },
  modalContent: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  postfixContainer: { height: '100%', justifyContent: 'center' },
});
