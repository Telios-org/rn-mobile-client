import { View } from 'react-native';
import styles from './styles';
import { Button } from '../../../Button';
import React from 'react';

export enum FilterOption {
  All = 'All',
  Unread = 'Unread',
  Read = 'Read',
}

export type FilterType = 'all' | 'read' | 'unread';

interface MailFilterProps {
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
}
export default ({ selectedFilter, onSelectFilter }: MailFilterProps) => {
  const filterOptionsItem = (optionType: FilterOption) => (
    <Button
      title={optionType}
      key={optionType}
      type="text"
      size="small"
      onPress={() => onSelectFilter(optionType)}
      style={styles.filterOptionsItem}
      titleStyle={
        selectedFilter === optionType
          ? styles.filterOptionsItemSelectedText
          : styles.filterOptionsItemUnselectedText
      }
    />
  );

  return (
    <View style={styles.filterOptionsContainer}>
      {Object.keys(FilterOption)?.map(key =>
        filterOptionsItem(FilterOption[key as keyof typeof FilterOption]),
      )}
    </View>
  );
};
