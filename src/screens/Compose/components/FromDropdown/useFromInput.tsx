import React from 'react';
import FromDropdown from './index';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectMailBoxAddress } from '../../../../store/selectors/email';
import { StyleProp, ViewStyle } from 'react-native';
import { SelectDropdownProps } from 'react-native-select-dropdown';

interface FromInputOptions {
  from: string;
  fromInput: React.ReactNode;
}
export default (
  fromInputDefault?: SelectDropdownProps['defaultValue'],
  fromInputStyle?: StyleProp<ViewStyle>,
): FromInputOptions => {
  const mailInbox = useSelector(selectMailBoxAddress);
  const [from, setFrom] = useState(fromInputDefault || mailInbox);

  return {
    from,
    fromInput: (
      <FromDropdown
        mailboxAddress={mailInbox}
        defaultValue={from}
        onSelect={setFrom}
        style={fromInputStyle}
      />
    ),
  };
};
