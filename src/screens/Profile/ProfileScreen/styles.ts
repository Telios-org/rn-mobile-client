import { StyleSheet } from 'react-native';
import { colors } from '../../../util/colors';
import { fonts } from '../../../util/fonts';
import { radius, spacing } from '../../../util/spacing';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: spacing.lg,
  },
  content: {
    flex: 1,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xs,
    justifyContent: 'space-between',
  },
  avatar: {
    marginBottom: spacing.xl,
    alignSelf: 'center',
  },
  displayName: {
    ...fonts.title3,
    color: colors.inkBase,
    lineHeight: 57,
  },
  mailbox: {
    ...fonts.regular.regular,
    color: colors.inkBase,
    marginTop: spacing.xs,
  },
  userStatus: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primaryBase,
    borderRadius: radius.xl,
    marginBottom: spacing.xxl,
    borderColor: colors.primaryBase,
    borderWidth: 2,
    alignSelf: 'flex-start',
  },
  userStatusText: {
    ...fonts.regular.medium,
    color: colors.white,
  },
  actionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
  },
  cancelButton: {
    paddingVertical: spacing.sm,
    borderColor: colors.primaryBase,
    borderWidth: 2,
    borderRadius: radius.xl,
    flexGrow: 0.45,
    alignItems: 'center',
  },
  cancelText: {
    ...fonts.regular.medium,
  },
  saveButton: {
    paddingVertical: spacing.sm,
    backgroundColor: colors.primaryBase,
    borderRadius: radius.xl,
    borderColor: colors.primaryBase,
    borderWidth: 2,
    flexGrow: 0.45,
    alignItems: 'center',
  },
  saveText: {
    ...fonts.regular.bold,
    color: colors.white,
  },
  flex1: {
    flex: 1,
  },
});

export default styles;
