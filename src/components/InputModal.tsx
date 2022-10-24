import React from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';

import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { spacing } from '../util/spacing';
import { Button } from './Button';
import { Input, InputProps } from './Input';

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  actionButtons: {
    flexDirection: 'row',
    marginVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  cancelBtn: { flex: 1, marginRight: spacing.md },
  doneBtn: { flex: 1 },
});

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
        <Modalize
          ref={ref}
          adjustToContentHeight
          scrollViewProps={{ keyboardShouldPersistTaps: 'always' }}>
          <KeyboardAvoidingView>
            <View style={styles.inputContainer}>
              <Input
                returnKeyType="done"
                onSubmitEditing={onDone}
                {...props.inputProps}
                value={value}
                error={touched ? error : undefined}
                onChangeText={text => {
                  setValue(text);
                  if (!touched) {
                    setTouched(true);
                  }
                }}
                autoFocus={true}
              />
            </View>
            <View style={styles.actionButtons}>
              <Button
                size="large"
                type="outline"
                style={styles.cancelBtn}
                title="Cancel"
                onPress={onCancel}
              />
              <Button
                size="large"
                style={styles.doneBtn}
                title="Done"
                onPress={onDone}
              />
            </View>
          </KeyboardAvoidingView>
        </Modalize>
      </Portal>
    </>
  );
});
