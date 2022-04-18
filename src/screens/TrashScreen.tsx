import React from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParams, RootStackParams } from '../Navigator';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useSelector } from 'react-redux';
import {
  FolderName,
  getFolderIdByName,
  trashMailListSelector,
} from '../store/mailSelectors';
import { getMailByFolder } from '../store/mail';
import { MailList, MailListItem } from '../components/MailList';
import { NavTitle } from '../components/NavTitle';
import { MailListHeader } from '../components/MailListHeader';

export type TrashScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'trash'>,
  NativeStackScreenProps<RootStackParams>
>;

export const TrashScreen = (props: TrashScreenProps) => {
  const mail = useAppSelector(state => state.mail);
  const dispatch = useAppDispatch();
  const trashMailList = useSelector(trashMailListSelector);

  React.useLayoutEffect(() => {
    dispatch(
      getMailByFolder({ id: getFolderIdByName(mail, FolderName.drafts) }),
    );
  }, [mail.folders]);

  const onSelectEmail = (emailId: string) => {
    // todo: navigate
  };

  const renderHeader = () => <MailListHeader title="Trash" />;

  const listData: MailListItem[] = trashMailList.map(item => ({
    id: item.emailId,
    mail: item,
    onSelect: () => onSelectEmail(item.emailId),
  }));

  return (
    <MailList
      navigation={props.navigation}
      renderNavigationTitle={() => <NavTitle>{'Trash'}</NavTitle>}
      headerComponent={renderHeader}
      loading={mail.loadingGetMailMeta}
      items={listData}
      disableUnreadFilters={true}
    />
  );
};
