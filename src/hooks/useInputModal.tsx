import { InputModal } from '../components/InputModal';
import { validateEmail } from '../util/regexHelpers';
import React, { useRef } from 'react';
import { Modalize } from 'react-native-modalize';

interface HookInputModalProps {
  onDone?: (value: string) => void;
  onCancel?: () => void;
}

export default ({ onDone, onCancel }: HookInputModalProps) => {
  const inputModalRef = useRef<Modalize>(null);
  const openModal = () => {
    inputModalRef.current?.open();
  };

  const closeModal = () => {
    inputModalRef.current?.close();
  };

  const inputModal = (
    <InputModal
      ref={inputModalRef}
      onCancel={() => {
        closeModal();
        onCancel?.();
      }}
      onDone={value => {
        closeModal();
        onDone?.(value);
      }}
      inputProps={{
        label: 'Forwarding Email Address',
        autoCapitalize: 'none',
        autoComplete: 'email',
        autoCorrect: false,
        keyboardType: 'email-address',
      }}
      validate={value => (validateEmail(value) ? undefined : 'Invalid email')}
    />
  );
  return {
    openModal,
    closeModal,
    inputModal,
  };
};
