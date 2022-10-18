import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';

export default StyleSheet.create({
  rightAction: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
  },
  actionText: {
    color: colors.white,
    paddingHorizontal: 10,
  },
});
