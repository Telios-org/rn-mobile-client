import { StyleSheet } from 'react-native';
import { fonts } from '../../util/fonts';
import { colors } from '../../util/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  input: {
    flex: 1,
    minWidth: 100,
  },
  list: {
    maxHeight: 100,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  previewText: {
    ...fonts.regular.regular,
    color: colors.primaryBase,
  },
});
