import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useAppDispatch } from '../hooks';
import { accountLogout } from '../mainSlice';

export const DrawerContent = (props: DrawerContentComponentProps) => {
  const dispatch = useAppDispatch();

  const onLogout = () => {
    dispatch(accountLogout());
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem label="Inbox" onPress={() => {}} />
      <DrawerItem label="Sign Out" onPress={onLogout} />
    </DrawerContentScrollView>
  );
};
