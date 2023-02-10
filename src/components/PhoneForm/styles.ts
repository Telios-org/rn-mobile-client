import { StyleSheet } from 'react-native';
import { spacing } from '../../util/spacing';
import { colors } from '../../util/colors';
import { fonts } from '../../util/fonts';

export default StyleSheet.create({
  textInput: {
    borderRadius: undefined,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownBtn: {
    backgroundColor: colors.skyLightest,
    borderColor: colors.skyBase,
    borderWidth: 1,
    borderRightWidth: 0,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    height: 55,
    width: 80,
    display: 'flex',
    marginHorizontal: undefined,
    paddingHorizontal: 5,
  },
  dropdownBtnTitle: {
    ...fonts.regular.medium,
    marginHorizontal: undefined,
  },
  dropdownStyle: {
    backgroundColor: colors.inkBase,
    borderRadius: 8,
  },
  dropdownText: {
    ...fonts.regular.medium,
    color: colors.white,
  },
  selectedRowText: {
    opacity: 0.5,
  },
  rowStyle: {
    borderBottomWidth: undefined,
    borderBottomColor: undefined,
    height: 35,
  },
  label: { color: colors.inkLight },
  phoneText: {
    marginBottom: spacing.md,
    minHeight: 25,
    ...fonts.regular.medium,
  },
  phoneInput: { flex: 1 },
});
