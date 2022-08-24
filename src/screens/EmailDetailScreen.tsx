import React, { useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import { Alert, ScrollView, Text, View } from 'react-native';
import { InboxStackParams } from '../Navigator';
import { spacing } from '../util/spacing';
import { colors } from '../util/colors';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fonts } from '../util/fonts';
import { NavIconButton } from '../components/NavIconButton';
import { selectMailByFolder } from '../store/selectors/email';
import { deleteMail, getMessageById } from '../store/thunks/email';
import { ToFrom } from '../store/types';
import { FoldersId } from '../store/types/enums/Folders';

export type EmailDetailScreenProps = NativeStackScreenProps<
  InboxStackParams,
  'emailDetail'
>;

export const EmailDetailScreen = (props: EmailDetailScreenProps) => {
  const { emailId, folderId } = props.route.params;
  const email = useAppSelector(state =>
    selectMailByFolder(state, folderId, emailId),
  );
  const isTrash = useAppSelector(state =>
    selectMailByFolder(state, FoldersId.trash, emailId),
  );

  const dispatch = useAppDispatch();

  // TODO: this might be slow at scale, if trash is huge.
  // const trashFolderId = getFolderIdByName(mailState, FolderName.trash);
  // const isTrash = mailState.mailIdsForFolder[trashFolderId]?.includes(emailId);

  const onDelete = async () => {
    try {
      if (isTrash) {
        // permanently delete if already in trash
        const deleteResponse = await dispatch(
          deleteMail({
            messageIds: [emailId],
          }),
        );

        if (deleteResponse.type === deleteMail.rejected.type) {
          throw new Error('Error deleting mail'); // todo, not a descriptive error
        }

        if (deleteResponse.type === deleteMail.fulfilled.type) {
        } else {
        }
      } else {
      }
    } catch (e) {
      console.log('error saving draft', e);
      Alert.alert('Error', 'Failed to delete mail');
    }
  };

  const onToggleUnread = () => {
    Alert.alert('Not implemented');
  };

  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <NavIconButton
            icon={{
              name: 'mail-unread-outline',
            }}
            onPress={onToggleUnread}
            padLeft
          />
          <NavIconButton
            icon={{
              name: 'trash-outline',
            }}
            onPress={onDelete}
            padLeft
          />
        </View>
      ),
    });
  }, [props.navigation]);

  useEffect(() => {
    dispatch(getMessageById({ id: emailId }));
  }, []);

  if (!email) {
    return (
      <View>
        <Text>Message doesn't exist</Text>
      </View>
    );
  }

  const fromArray = JSON.parse(email.fromJSON) as Array<ToFrom>;
  const from = fromArray?.[0];

  const dayFormatted = format(new Date(email.date), 'dd MMM yyyy');
  const timeFormatted = format(new Date(email.date), 'p');
  const fullDateText = `${dayFormatted} at ${timeFormatted}`;

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <View style={{ margin: spacing.lg }}>
        <Text style={fonts.title3}>{email.subject}</Text>
        <View style={{ marginTop: spacing.lg }}>
          <Text>{from.name || from.address}</Text>
          <Text>{fullDateText}</Text>
        </View>
        <View style={{ marginTop: spacing.lg }}>
          <Text style={fonts.regular.regular}>{email.bodyAsText}</Text>
        </View>
      </View>
    </ScrollView>
  );
};
