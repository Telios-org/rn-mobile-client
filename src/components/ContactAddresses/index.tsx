import React from 'react';
import { View } from 'react-native';
import AddressForm from '../AddressForm';
import { Address } from '../../store/types';

interface ContactAddressesProps {
  addresses: Address[];
  isEditing?: boolean;
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void;
  errors?: { [key: string]: string } | undefined | string;
}

export default ({
  addresses,
  isEditing,
  setFieldValue,
  errors,
}: ContactAddressesProps) => {
  const updateAddresses = (newAddress: Address, index: number) => {
    const newAddresses = [...addresses];
    newAddresses[index] = newAddress;
    setFieldValue?.('address', newAddresses);
  };

  return (
    <>
      {addresses.map((address, index) => (
        <View key={index}>
          <AddressForm
            isEditing={isEditing}
            address={address}
            onChangeAddress={value => updateAddresses(value, index)}
            errors={
              typeof errors === 'object' ? errors?.address?.[index] : errors
            }
          />
        </View>
      ))}
    </>
  );
};
