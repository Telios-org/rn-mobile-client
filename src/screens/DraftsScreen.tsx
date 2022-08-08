import React from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParams, RootStackParams } from '../Navigator';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useSelector } from 'react-redux';
import { draftsMailListSelector } from '../store/selectors/mail';
import { MailList, MailListItem } from '../components/MailList';
import { NavTitle } from '../components/NavTitle';
import { MailListHeader } from '../components/MailListHeader';

export type DraftsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'drafts'>,
  NativeStackScreenProps<RootStackParams>
>;

export const DraftsScreen = (props: DraftsScreenProps) => {
  const mail = useAppSelector(state => state.mail);
  const dispatch = useAppDispatch();
  const draftsMailList = useSelector(draftsMailListSelector);

  // React.useLayoutEffect(() => {
  //   dispatch(
  //     getMailByFolder({ id: getFolderIdByName(mail, FolderName.drafts) }),
  //   );
  // }, [mail.folders]);

  const onSelectEmail = (emailId: string) => {
    // todo: navigate
  };

  const renderHeader = () => <MailListHeader title="Drafts" />;

  const listData: MailListItem[] = draftsMailList.map(item => ({
    id: item.emailId,
    mail: item,
    onSelect: () => onSelectEmail(item.emailId),
  }));

  return (
    <MailList
      navigation={props.navigation}
      renderNavigationTitle={() => <NavTitle>{'Drafts'}</NavTitle>}
      headerComponent={renderHeader}
      loading={mail.loadingGetMailMeta}
      items={listData}
      disableUnreadFilters={true}
    />
  );
};
