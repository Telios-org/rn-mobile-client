import React, { useState } from 'react';
import { Text, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { Phone } from '../../store/types';
import { Icon } from '../Icon';
import { colors } from '../../util/colors';
import { Input, Label } from '../Input';
import styles from './styles';

interface PhoneFormProps {
  isEditing?: boolean;
  phones: Phone[];
  onPhoneUpdate?: (
    field: string,
    value: Phone[],
    shouldValidate?: boolean,
  ) => void;
}

interface PhoneInputProps {
  isEditing?: boolean;
  phone?: Phone;
  onPhoneChange?: (phone: Phone) => void;
}

const PhoneInput = ({ isEditing, phone, onPhoneChange }: PhoneInputProps) => {
  const [phoneType, setPhoneType] = useState(phone?.type || 'Cell');

  const handlePhoneChange = (value: string | undefined) => {
    if (value) {
      onPhoneChange?.({ type: phoneType, value });
    } else {
      onPhoneChange?.({ type: undefined, value: '' });
    }
  };

  if (!isEditing) {
    return (
      <>
        <Label
          labelStyle={styles.label}
          label={phone?.value ? `${phoneType} Phone` : 'Phone'}
        />
        <Text style={styles.phoneText}>{phone?.value}</Text>
      </>
    );
  }

  return (
    <>
      <Label labelStyle={styles.label} label="Phone" />
      <View style={styles.phoneInputContainer}>
        <SelectDropdown
          disabled={!isEditing}
          data={['Cell', 'Home', 'Work', 'Other']}
          defaultValue={phoneType}
          buttonStyle={styles.dropdownBtn}
          buttonTextStyle={styles.dropdownBtnTitle}
          dropdownOverlayColor={'transparent'}
          dropdownStyle={styles.dropdownStyle}
          rowStyle={styles.rowStyle}
          rowTextStyle={styles.dropdownText}
          selectedRowTextStyle={styles.selectedRowText}
          renderDropdownIcon={() => (
            <Icon name="ios-chevron-down" size={18} color={colors.skyBase} />
          )}
          onSelect={value => {
            setPhoneType(value);
            handlePhoneChange(phone?.value);
          }}
          buttonTextAfterSelection={title => title}
          rowTextForSelection={title => title}
        />
        <Input
          style={styles.phoneInput}
          textInputStyle={styles.textInput}
          value={phone?.value}
          autoCapitalize="none"
          placeholder="+1 (910) 999-9999"
          keyboardType={'phone-pad'}
          autoCorrect={false}
          onChangeText={handlePhoneChange}
        />
      </View>
    </>
  );
};

export default ({ phones, isEditing, onPhoneUpdate }: PhoneFormProps) => {
  const updatePhones = (newPhone: Phone) => {
    // we support only one phone number for now
    onPhoneUpdate?.('phone', [newPhone]);
  };
  return (
    <>
      {phones.map((phone, index) => (
        <View key={index}>
          <PhoneInput
            isEditing={isEditing}
            phone={phone}
            onPhoneChange={updatePhones}
          />
        </View>
      ))}
    </>
  );
};
