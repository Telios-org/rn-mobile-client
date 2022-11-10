import { StyleSheet } from 'react-native';
import { spacing } from '../../util/spacing';
import { colors } from '../../util/colors';
import { fonts } from '../../util/fonts';

export default StyleSheet.create({
  image: {
    width: '100%',
    height: 300,
  },
  imageContainer: {
    marginTop: spacing.xxl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryBase,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 30,
  },
  percentageText: {
    marginRight: 15,
  },
  btnText: {
    ...fonts.regular.medium,
    color: colors.white,
  },
  syncingMessage: {
    ...fonts.regular.regular,
    marginTop: spacing.sm,
  },
});
