import React from 'react';
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { colors } from '../util/colors';
import { fonts } from '../util/fonts';
import { borderRadius, spacing } from '../util/spacing';
import { Button } from './Button';
import { DropdownInput, DropdownInputProps } from './DropdownInput';
import { Icon } from './Icon';

export type MultiSelectOption = {
  label: string;
  value: string;
  labelStyle?: StyleProp<TextStyle>;
  rightIcon?: { name: string; color?: string; size?: number };
  onPress?: (selectCallback: () => void) => void;
};
export type MultiSelectInputProps = Omit<
  DropdownInputProps,
  'onPress' | 'value'
> & {
  values?: string[];
  options: Array<MultiSelectOption>;
  modalTitle?: string;
  onChange: (values: string[]) => void;
};

export const MultiSelectInput = (props: MultiSelectInputProps) => {
  const { options, onChange, values, ...restOfProps } = props;
  const modalizeRef = React.useRef<Modalize>();

  const [selectedValues, setSelectedValues] = React.useState<string[]>(
    values || [],
  );

  const openModal = () => {
    console.log('open modal', modalizeRef.current);
    modalizeRef.current?.open();
  };

  const onSelectValue = (value: string) => {
    let newValues = [...selectedValues];
    const index = selectedValues.indexOf(value);
    if (index > -1) {
      newValues.splice(index, 1);
    } else {
      newValues.push(value);
    }
    setSelectedValues(newValues);
  };

  const onDone = () => {
    modalizeRef.current?.close();
    onChange(selectedValues);
  };

  const valueText = values?.reduce((previousValue, currentValue, index) => {
    let next = previousValue + currentValue;
    if (index < values.length - 1) {
      next = next + `\n`;
    }
    return next;
  }, '');

  return (
    <>
      <DropdownInput {...restOfProps} value={valueText} onPress={openModal} />
      <Portal>
        <Modalize ref={modalizeRef} adjustToContentHeight={true}>
          <View
            style={{
              marginHorizontal: spacing.lg,
              marginTop: spacing.xl,
              marginBottom: spacing.lg,
            }}>
            <Text style={fonts.title3}>
              {props.modalTitle || props.label || 'Select'}
            </Text>
            <View style={{ marginVertical: spacing.lg }}>
              {props.options.map(option => (
                <MultiSelectCell
                  key={`multiselect-${option.value}`}
                  selected={selectedValues.includes(option.value)}
                  option={option}
                  onPress={() => {
                    if (option.onPress) {
                      const selectCallback = () => onSelectValue(option.value);
                      option.onPress(selectCallback);
                    } else {
                      onSelectValue(option.value);
                    }
                  }}
                  style={{ marginBottom: spacing.sm }}
                />
              ))}
            </View>
            <Button title="Done" onPress={onDone} />
          </View>
        </Modalize>
      </Portal>
    </>
  );
};

const MultiSelectCell = (props: {
  selected: boolean;
  option: MultiSelectOption;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) => {
  const rightIcon = props.option.rightIcon;
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[
        { flexDirection: 'row', alignItems: 'center', minHeight: 55 },
        props.style,
      ]}>
      <View style={{ flex: 1 }}>
        <Text style={[fonts.regular.medium, props.option.labelStyle]}>
          {props.option.label}
        </Text>
      </View>
      <View
        style={{ width: 50, justifyContent: 'center', alignItems: 'center' }}>
        {rightIcon ? (
          <Icon
            name={rightIcon.name}
            size={rightIcon.size || 24}
            color={rightIcon.color || colors.skyDark}
          />
        ) : (
          <View
            style={{
              height: 26,
              width: 26,
              borderRadius: 13,
              backgroundColor: props.selected
                ? colors.success
                : colors.skyLighter,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              name={'checkmark-outline'}
              size={20}
              color={props.selected ? colors.white : 'transparent'}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
