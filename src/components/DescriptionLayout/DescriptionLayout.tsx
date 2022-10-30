import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';

import styles from './styles';

export type DescriptionLayoutProps = {
  title?: string;
  description?: string;
  children?: ReactNode;
};

const DescriptionLayout = ({
  title,
  description,
  children,
}: DescriptionLayoutProps) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionDescription}>{description}</Text>
      {children}
    </View>
  );
};

export default DescriptionLayout;
