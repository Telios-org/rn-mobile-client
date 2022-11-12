import React from 'react';
import SelectDropdown, {
  SelectDropdownProps,
} from 'react-native-select-dropdown';
import { Icon } from '../../../../components/Icon';
import styles from './styles';
import { colors } from '../../../../util/colors';
import { fonts } from '../../../../util/fonts';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { useSelector } from 'react-redux';
import { aliasIdsSelector } from '../../../../store/selectors/aliases';
import { EMAIL_POSTFIX } from '../../../../constants/Constants';

export interface FromDropdownProps {
  mailboxAddress: string | undefined;
  defaultValue: SelectDropdownProps['defaultValue'];
  onSelect: SelectDropdownProps['onSelect'];
  style?: StyleProp<ViewStyle>;
}

export default ({
  defaultValue,
  style,
  onSelect,
  mailboxAddress,
}: FromDropdownProps) => {
  const aliases = useSelector(aliasIdsSelector);
  const fullAliases = aliases.map(alias => alias + '@' + EMAIL_POSTFIX);

  return (
    <View style={[styles.container, style]}>
      <Text style={fonts.regular.medium}>{'From'}</Text>
      <SelectDropdown
        defaultButtonText="Please select an email..."
        defaultValue={defaultValue}
        data={[mailboxAddress, ...fullAliases]}
        buttonStyle={styles.dropdownBtn}
        buttonTextStyle={styles.dropdownBtnText}
        dropdownOverlayColor={'rgba(0,0,0,0.2)'}
        dropdownStyle={styles.dropdownStyle}
        rowStyle={styles.rowStyle}
        rowTextStyle={styles.rowTextStyle}
        selectedRowTextStyle={styles.selectedRowText}
        renderDropdownIcon={() => (
          <Icon name="ios-chevron-down" size={24} color={colors.skyBase} />
        )}
        onSelect={onSelect}
        buttonTextAfterSelection={title => title}
        rowTextForSelection={title => title}
      />
    </View>
  );
};
