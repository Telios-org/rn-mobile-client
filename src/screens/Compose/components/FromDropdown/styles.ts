import { StyleSheet } from 'react-native';
import { colors } from '../../../../util/colors';
import { fonts } from '../../../../util/fonts';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 50,
  },
  dropdownBtn: {
    flex: 1,
    height: 49,
    backgroundColor: colors.white,
  },
  dropdownBtnText: {
    textAlign: 'left',
    ...fonts.regular.regular,
  },
  dropdownStyle: {
    borderRadius: 12,
  },
  rowTextStyle: {
    marginLeft: 15,
    textAlign: 'left',
    ...fonts.regular.regular,
  },
  rowStyle: {
    borderBottomWidth: undefined,
    borderBottomColor: undefined,
  },
  selectedRowText: {
    fontWeight: 'bold',
  },
});
