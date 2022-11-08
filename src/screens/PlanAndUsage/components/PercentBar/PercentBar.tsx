import React, { memo } from 'react';
import { View, Text } from 'react-native';

import styles from './styles';

export type PercentBarProps = {
  name: string;
  total?: number;
  completed?: number;
};

const PercentBar = ({ name, total = 0, completed = 0 }: PercentBarProps) => {
  const completedPercent = (completed / total) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {name}
        </Text>
        <Text
          style={styles.usesTitle}
          numberOfLines={2}>{`${completed} of ${total} included`}</Text>
      </View>
      <View style={styles.totalLine}>
        <View
          style={[styles.completedLine, { width: `${completedPercent}%` }]}
        />
      </View>
    </View>
  );
};

export default memo(PercentBar);
