import React from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { MainStackParams, RootStackParams } from '../Navigator';
import { useAppDispatch, useAppSelector } from '../hooks';
import { FolderName, getFolderIdByName } from '../store/mailSelectors';
import { getMailByFolder } from '../store/mail';

export type TrashScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'trash'>,
  NativeStackScreenProps<RootStackParams>
>;

export const TrashScreen = (props: TrashScreenProps) => {
  const mailState = useAppSelector(state => state.mail);
  const trashFolderId = getFolderIdByName(mailState, FolderName.trash);
  const dispatch = useAppDispatch();

  React.useLayoutEffect(() => {
    if (trashFolderId) {
      dispatch(getMailByFolder({ id: trashFolderId }));
    }
  }, []);

  return <View style={{ flex: 1 }}></View>;
};
