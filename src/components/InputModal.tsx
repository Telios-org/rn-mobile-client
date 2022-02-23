import React, { useEffect, useState } from 'react';
import {
  InputAccessoryView,
  KeyboardAvoidingView,
  TextInput,
  View,
} from 'react-native';

import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { spacing } from '../util/spacing';
import { Button } from './Button';
import { Input, InputProps } from './Input';

const accessoryId = 'input-modal-accessory';

export type InputModalProps = {
  inputProps: Omit<
    InputProps,
    'value' | 'onChangeText' | 'error' | 'autoFocus' | 'inputAccessoryViewID'
  >;
  onCancel: () => void;
  onDone: (value: string) => void;
  validate?: (value: string) => string | undefined;
};

export const InputModal = React.forwardRef<
  { open: () => void; close: () => void },
  InputModalProps
>((props, ref) => {
  const [value, setValue] = React.useState('');
  const [touched, setTouched] = React.useState(false);
  const error = props.validate ? props.validate(value) : undefined;

  const onDone = () => {
    if (!error) {
      props.onDone(value);
      setValue('');
    }
  };

  const onCancel = () => {
    props.onCancel();
    setValue('');
  };
  return (
    <>
      <Portal>
        <Modalize ref={ref} adjustToContentHeight={true}>
          <KeyboardAvoidingView>
            <View
              style={{
                marginHorizontal: spacing.lg,
                marginTop: spacing.xl,
                marginBottom: spacing.lg,
              }}>
              <Input
                returnKeyType="done"
                onSubmitEditing={onDone}
                {...props.inputProps}
                value={value}
                error={touched && error}
                onChangeText={text => {
                  setValue(text);
                  if (!touched) {
                    setTouched(true);
                  }
                }}
                autoFocus={true}
                inputAccessoryViewID={accessoryId}
              />
            </View>
          </KeyboardAvoidingView>
        </Modalize>
      </Portal>
      <InputAccessoryView nativeID={accessoryId}>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: spacing.sm,
            paddingHorizontal: spacing.lg,
          }}>
          <Button
            size="large"
            type="outline"
            style={{ flex: 1 }}
            title="Cancel"
            onPress={props.onCancel}
          />
          <View style={{ width: spacing.md }} />
          <Button
            size="large"
            style={{ flex: 1 }}
            title="Done"
            onPress={onDone}
          />
        </View>
      </InputAccessoryView>
    </>
  );
});
