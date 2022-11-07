import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';

import PercentBar, { PercentBarProps } from '../PercentBar/PercentBar';
import styles from './styles';

type SectionProps = {
  leftIcon: ReactNode;
  title: string;
  description: string;
  percentData: PercentBarProps[];
};

const Section = ({
  leftIcon,
  title,
  description,
  percentData,
}: SectionProps) => (
  <View style={styles.sectionContainer}>
    <View style={styles.headerContainer}>
      <View style={styles.headerIcon}>{leftIcon}</View>
      <View style={styles.headerText}>
        <Text style={styles.sectionHeader}>{title}</Text>
        <Text style={styles.sectionDescription}>{description}</Text>
      </View>
    </View>
    <View style={styles.content}>
      {percentData?.map((item, index) => (
        <PercentBar
          name={item.name}
          total={item.total}
          completed={item.completed}
          key={`PercentBar-${index}`}
        />
      ))}
    </View>
  </View>
);

export default Section;
