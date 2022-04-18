import React from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { MainStackParams, RootStackParams } from '../Navigator';
import { useAppDispatch, useAppSelector } from '../hooks';
import { FolderName, getFolderIdByName } from '../store/mailSelectors';
import { getMailByFolder } from '../store/mail';

export type SentScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'sent'>,
  NativeStackScreenProps<RootStackParams>
>;

export const SentScreen = (props: SentScreenProps) => {
  const mailState = useAppSelector(state => state.mail);
  const sentFolderId = getFolderIdByName(mailState, FolderName.sent);
  const dispatch = useAppDispatch();

  React.useLayoutEffect(() => {
    if (sentFolderId) {
      dispatch(getMailByFolder({ id: sentFolderId }));
    }
  }, []);

  return <View style={{ flex: 1 }}></View>;
};
