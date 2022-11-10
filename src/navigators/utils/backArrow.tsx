import React from 'react';
import { NavIconButton } from '../../components/NavIconButton';

export default ({ navigation }: any) => ({
  headerLeft: () => (
    <NavIconButton
      icon={{ name: 'chevron-back', size: 28 }}
      onPress={() => navigation.goBack()}
    />
  ),
});
