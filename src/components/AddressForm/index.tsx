import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import ContactField from '../ContactField';
import { Address } from '../../store/types';
import styles from './styles';
import CountryPicker, { Country } from 'react-native-country-picker-modal';
import { Label } from '../Input';
import { colors } from '../../util/colors';
import { getCountryNameAsync } from 'react-native-country-picker-modal/lib/CountryService';

interface AddressFormProps {
  isEditing?: boolean;
  address?: Address;
  onChangeAddress: (address: Address) => void;
  errors?: { [key: string]: string } | undefined | string;
}

export default ({
  isEditing,
  address,
  onChangeAddress,
  errors,
}: AddressFormProps) => {
  const [countryName, setCountryName] = useState<string>();
  const [isAddressVisible, setIsAddressVisible] = useState(!!address?.country);
  const { country, street, street2, state, city, postalCode } = address || {};

  const onSelectCountry = (value: Country | undefined) => {
    handleAddressChange({
      country: value?.cca2,
    });
    setIsAddressVisible(!!value?.cca2);
  };
  const handleAddressChange = (value: Partial<Address>) => {
    onChangeAddress({ street: '', city: '', ...address, ...value });
  };

  const getError = (errorKey: string) => {
    if (errorKey && errors && typeof errors === 'object') {
      return errors[errorKey];
    }
  };

  useEffect(() => {
    if (country) {
      getCountryNameAsync(country as any).then(name => {
        setCountryName(name);
      });
      setIsAddressVisible(true);
    }
  }, [country]);

  const hideField = (field: string | undefined) => !field && !isEditing;
  return (
    <View>
      {isEditing ? (
        <>
          <Label labelStyle={styles.countryLabel} label="Country" />
          <CountryPicker
            countryCode={address?.country as any}
            onSelect={onSelectCountry}
            /* @ts-ignore */
            placeholder="Select Country..."
            containerButtonStyle={styles.countryBtn}
            withFilter
            withCountryNameButton
            theme={{
              onBackgroundTextColor: colors.inkDarker,
              fontSize: 16,
            }}
            modalProps={{ presentationStyle: 'pageSheet' }}
          />
        </>
      ) : (
        <ContactField
          isEditing={isEditing}
          label="Country"
          value={countryName}
          placeholder="Street"
          onChangeText={value => handleAddressChange({ street: value })}
          error={getError('street')}
        />
      )}
      {isAddressVisible && (
        <View>
          <ContactField
            isEditing={isEditing}
            label="Street"
            value={street}
            placeholder="Street"
            onChangeText={value => handleAddressChange({ street: value })}
            error={getError('street')}
          />
          {!hideField(street2) && (
            <ContactField
              isEditing={isEditing}
              label="Street2"
              value={street2}
              placeholder="Street2"
              onChangeText={value => handleAddressChange({ street2: value })}
            />
          )}
          <ContactField
            isEditing={isEditing}
            label="City"
            value={city}
            placeholder="City"
            error={getError('city')}
            onChangeText={value => handleAddressChange({ city: value })}
          />
          {!hideField(state) && (
            <ContactField
              isEditing={isEditing}
              label="State"
              value={state}
              placeholder="State"
              error={getError('state')}
              onChangeText={value => handleAddressChange({ state: value })}
            />
          )}
          {!hideField(postalCode) && (
            <ContactField
              isEditing={isEditing}
              label="Postal Code"
              value={postalCode}
              placeholder="ZIP / Postal Code"
              onChangeText={value => handleAddressChange({ postalCode: value })}
              onBlur={() => handleAddressChange({ postalCode })}
              onEndEditing={() => handleAddressChange({ postalCode })}
            />
          )}
        </View>
      )}
    </View>
  );
};
