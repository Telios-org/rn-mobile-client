import { StyleSheet } from 'react-native';
import { spacing } from '../../util/spacing';

export default StyleSheet.create({
  sectionTitle: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aliasManageButton: { paddingLeft: spacing.lg },
});
