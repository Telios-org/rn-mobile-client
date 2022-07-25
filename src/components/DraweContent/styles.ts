import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../util/spacing';

export default StyleSheet.create({
  logoContainer: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  logo: { width: '40%', height: '100%' },
  profileBtn: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  profileBtnContent: {
    flexDirection: 'row',
    height: 50,
    borderRadius: borderRadius,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileAddress: { flex: 1 },
  drawerContainer: { marginTop: spacing.lg },
});
