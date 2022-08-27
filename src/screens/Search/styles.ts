import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';
import { fonts, textStyles } from '../../util/fonts';
import { radius, spacing } from '../../util/spacing';

const SearchScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContainer: {
    flex: 1,
  },
  text: {
    ...fonts.regular.regular,
    color: textStyles.titleColor,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.skyLighter,
  },
  textInput: {
    flex: 1,
    fontWeight: textStyles.weights.regular,
    fontSize: textStyles.sizes.regular,
    color: textStyles.titleColor,
    paddingLeft: spacing.lg,

    backgroundColor: colors.skyLighter,

    height: 36,
    borderRadius: radius.s,
  },
  cancelContainer: {
    paddingHorizontal: spacing.md,
  },

  noResultText: {
    ...fonts.regular.regular,
    color: colors.skyBase,
  },
  noResultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SearchScreenStyles;
