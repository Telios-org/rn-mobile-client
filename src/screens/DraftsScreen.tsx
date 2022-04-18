import React from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Animated, Text, View } from 'react-native';
import { MainStackParams, RootStackParams } from '../Navigator';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fonts, textStyles } from '../util/fonts';
import { colors } from '../util/colors';
import { spacing } from '../util/spacing';
import { Icon } from '../components/Icon';
import { EmailCell } from '../components/EmailCell';
import { useSelector } from 'react-redux';
import {
  draftsMailListSelector,
  FolderName,
  getFolderIdByName,
} from '../store/mailSelectors';
import { getMailByFolder, LocalEmail } from '../store/mail';
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

  React.useLayoutEffect(() => {
    dispatch(
      getMailByFolder({ id: getFolderIdByName(mail, FolderName.drafts) }),
    );
  }, [mail.folders]);

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
