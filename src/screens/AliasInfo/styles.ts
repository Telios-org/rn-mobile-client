import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';
import { spacing } from '../../util/spacing';
import { fonts } from '../../util/fonts';

export default StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
    paddingVertical: spacing.lg,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  aliasLongNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  aliasTextContainer: { flex: 1 },
  lighterText: {
    ...fonts.small.regular,
    color: colors.inkLighter,
  },
  sectionContainer: {
    marginHorizontal: spacing.lg,
  },
  separatorLine: {
    height: 1,
    backgroundColor: colors.skyLighter,
    marginVertical: spacing.lg,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusIndicator: {
    width: 10,
    aspectRatio: 1,
    borderRadius: 5,
    marginLeft: 7,
  },
  statusIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fwdAddrContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButton: {
    borderColor: colors.error,
  },
  multiSelectInput: {
    borderWidth: 0,
    paddingVertical: 0,
    paddingLeft: 0,
  },
});
