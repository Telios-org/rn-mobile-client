import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';
import { textStyles } from '../../util/fonts';

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
  extraSmallImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
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
    fontWeight: textStyles.weights.semiBold,
    color: colors.white,
  },
  extraSmallDisplayName: {
    fontSize: 14,
  },
  smallDisplayName: {
    fontSize: 19,
  },
  largeDisplayName: {
    fontSize: 40,
  },
});

export default styles;
