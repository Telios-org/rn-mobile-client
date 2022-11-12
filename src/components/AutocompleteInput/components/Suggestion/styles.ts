import { StyleSheet } from 'react-native';
import { fonts } from '../../../../util/fonts';
import { colors } from '../../../../util/colors';

export default StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 3,
    borderColor: colors.inkBase,
    borderWidth: 0.5,
    backgroundColor: colors.white,
  },
  label: {
    ...fonts.regular.regular,
  },
});
