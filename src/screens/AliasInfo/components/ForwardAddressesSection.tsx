import { View } from 'react-native';
import styles from '../styles';
import { MultiSelectInput } from '../../../components/MultiSelectInput';
import { colors } from '../../../util/colors';
import React, { useEffect, useRef, useState } from 'react';
import useInputModal from '../../../hooks/useInputModal';
import { updateAliasFlow } from '../../../store/aliases';
import { useAppDispatch } from '../../../hooks';
import { SectionPropsType } from './SectionPropsType';

interface ForwardAddressesSectionProps extends SectionPropsType {
  aliasFwdAddresses: string[];
}

export default ({
  aliasId,
  domain,
  aliasFwdAddresses,
}: ForwardAddressesSectionProps) => {
  const fireUpdate = useRef(false);
  const dispatch = useAppDispatch();
  const [fwdAddresses, setFwdAddresses] = useState<string[]>(aliasFwdAddresses);
  const { inputModal, openModal } = useInputModal({
    onDone: value => {
      if (value && !fwdAddresses.includes(value)) {
        setFwdAddresses([...fwdAddresses, value]);
      }
    },
  });

  useEffect(() => {
    if (fireUpdate.current) {
      dispatch(
        updateAliasFlow({
          aliasId: aliasId,
          domain,
          fwdAddresses: fwdAddresses,
        }),
      );
    }
    fireUpdate.current = true;
  }, [fwdAddresses]);

  return (
    <>
      <View style={styles.sectionContainer}>
        <MultiSelectInput
          label="Forwarding Addresses"
          placeholder="Add forwarding address"
          values={fwdAddresses}
          options={[
            ...fwdAddresses.map(address => ({
              label: address,
              value: address,
            })),
            {
              label: 'Add New',
              value: 'ADD_NEW',
              labelStyle: { color: colors.primaryBase },
              rightIcon: {
                name: 'add-outline',
                color: colors.primaryBase,
              },
              onPress: openModal,
            },
          ]}
          onChange={addresses => setFwdAddresses(addresses)}
          buttonStyle={styles.multiSelectInput}
        />
      </View>
      {inputModal}
    </>
  );
};
