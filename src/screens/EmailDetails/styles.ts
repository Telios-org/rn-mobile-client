import { StyleSheet } from 'react-native';
import { spacing } from '../../util/spacing';
import { colors } from '../../util/colors';
import { fonts } from '../../util/fonts';

export default StyleSheet.create({
  bodyContainer: {
    flex: 1,
    marginTop: spacing.lg,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  rowDirectionCentered: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 14,
  },
  senderContainer: {
    marginTop: spacing.md,
    justifyContent: 'space-between',
  },
  senderName: {
    fontSize: 16,
    color: colors.inkDarkest,
  },
  receiveDate: {
    color: colors.inkLight,
  },
  replyBtn: { marginRight: spacing.lg },
  bodyText: {
    ...fonts.regular.regular,
    color: colors.black,
  },
  loadingContainer: { margin: spacing.lg },
  flex1: { flex: 1 },
});
