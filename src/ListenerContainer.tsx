import React from 'react';
import { View } from 'react-native';
import { useAppDispatch } from './hooks';
import { createNodeListener } from './nodeListener';

export const ListenerContainer = () => {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    createNodeListener(dispatch);
  }, []);
  return <View />;
};
