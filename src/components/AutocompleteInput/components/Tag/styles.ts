import { StyleSheet } from 'react-native';
import { colors } from '../../../../util/colors';
import { fonts } from '../../../../util/fonts';

export default StyleSheet.create({
  tagContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    backgroundColor: colors.skyLighter,
    borderRadius: 4,
    padding: 3,
    marginRight: 3,
    marginBottom: 3,
  },
  textContainer: { flexShrink: 1 },
  tagText: {
    ...fonts.regular.regular,
  },
  loading: {
    marginHorizontal: 2,
  },
});
