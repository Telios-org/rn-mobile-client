import React, { useMemo, useState } from 'react';
import { Text, View, Pressable, TextInputProps } from 'react-native';
import RNDatePicker from 'react-native-date-picker';
import { format } from 'date-fns';

import { Label } from '../Input';
import styles from './styles';

type DatePickerProps = TextInputProps & {
  label: string;
  date: string | undefined;
  style?: object;
  isEditing?: boolean;
  onConfirm: (date: Date) => void;
};

const DISPLAY_DATE_FORMAT = 'dd-MM-yyyy';

const DatePicker = ({
  label,
  date,
  style = {},
  isEditing = false,
  onConfirm,
}: DatePickerProps) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const formatedDate = useMemo(
    () => (date ? format(new Date(date), DISPLAY_DATE_FORMAT) : ''),
    [date],
  );

  const toggleDatePickerVisibility = () => setOpenDatePicker(prev => !prev);

  const onChooseDate = (choosedDate: Date) => {
    onConfirm(choosedDate);
    toggleDatePickerVisibility();
  };
  return (
    <Pressable
      style={[styles.textInputContainer, style]}
      onPress={toggleDatePickerVisibility}>
      <Label labelStyle={styles.label} label={label} />
      {isEditing ? (
        <View style={styles.textInput}>
          <Text style={styles.editText}>{formatedDate}</Text>
        </View>
      ) : (
        <Text style={styles.text}>{formatedDate}</Text>
      )}
      <RNDatePicker
        open={openDatePicker}
        mode="date"
        date={date ? new Date(date) : new Date()}
        onConfirm={onChooseDate}
        onCancel={toggleDatePickerVisibility}
        modal
      />
    </Pressable>
  );
};

export default DatePicker;
