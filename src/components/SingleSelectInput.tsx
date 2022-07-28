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
import { spacing } from '../util/spacing';
import { DropdownInput, DropdownInputProps } from './DropdownInput';
import { Icon } from './Icon';

export type SingleSelectOption = {
  label: string;
  value: string;
  labelStyle?: StyleProp<TextStyle>;
  rightIcon?: { name: string; color?: string; size?: number };
};
export type SingleSelectInputProps = Omit<DropdownInputProps, 'onPress'> & {
  options: Array<SingleSelectOption>;
  modalTitle?: string;
  onSelect: (value: string) => void;
};

export const SingleSelectInput = (props: SingleSelectInputProps) => {
  const { onSelect, ...restOfProps } = props;
  const modalizeRef = React.useRef<Modalize>();

  const openModal = () => {
    modalizeRef.current?.open();
  };

  const onSelectValue = (value: string) => {
    modalizeRef.current?.close();
    onSelect(value);
  };
  return (
    <>
      <DropdownInput {...restOfProps} onPress={openModal} />
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
                <SingleSelectCell
                  key={`singleselect-${option.value}`}
                  option={option}
                  onPress={() => onSelectValue(option.value)}
                  style={{ marginBottom: spacing.sm }}
                />
              ))}
            </View>
          </View>
        </Modalize>
      </Portal>
    </>
  );
};

const SingleSelectCell = (props: {
  option: SingleSelectOption;
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
          <Icon
            name={'chevron-forward-outline'}
            size={24}
            color={colors.skyDark}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};
