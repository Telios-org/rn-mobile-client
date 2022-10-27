import { StyleSheet } from 'react-native';

import { spacing, radius } from '../../../util/spacing';
import { fonts } from '../../../util/fonts';
import { colors } from '../../../util/colors';

export default StyleSheet.create({
  container: {
    width: '100%',
    height: 160,
    marginBottom: 40,
  },
  backButton: {
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
    marginLeft: spacing.md,
    marginTop: spacing.md,
    borderRadius: radius.xl,
    paddingVertical: 2,
  },
  avatar: {
    borderWidth: 3,
    borderColor: colors.white,
    position: 'absolute',
    bottom: -40,
    left: 36,
  },
  editButton: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    right: spacing.md,
    top: spacing.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.s,
    borderColor: colors.white,
  },
  editText: {
    ...fonts.regular.regular,
    color: colors.white,
  },
});
