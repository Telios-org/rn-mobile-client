import { StyleSheet } from 'react-native';

import { colors } from '../../util/colors';
import { spacing } from '../../util/spacing';
import { fonts } from '../../util/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  sectionList: {
    backgroundColor: colors.white,
    flex: 1,
  },
  sectionHeader: {
    borderTopWidth: 1,
    borderColor: colors.skyLight,
    backgroundColor: colors.skyLighter,
    paddingLeft: spacing.md,
    paddingVertical: spacing.xs,
  },
  noResultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultText: {
    ...fonts.regular.regular,
    color: colors.skyBase,
  },
});
