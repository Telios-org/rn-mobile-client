import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';
import { fonts } from '../../util/fonts';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.skyLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressableContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primaryBase,
    zIndex: 1000,
  },
  editable: {
    opacity: 0.5,
  },
  smallImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  largeImage: {
    width: 106,
    height: 106,
    borderRadius: 63,
  },
  displayName: {
    ...fonts.title1,
    color: colors.white,
  },
  smallDisplayName: {
    fontSize: 26,
  },
  largeDisplayName: {
    fontSize: 66,
  },
});

export default styles;
