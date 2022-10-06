import React, { useEffect, useLayoutEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { RootStackParams } from '../Navigator';
import { spacing } from '../util/spacing';
import { colors } from '../util/colors';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fonts } from '../util/fonts';
import { NavIconButton } from '../components/NavIconButton';
import { selectMailByFolder } from '../store/selectors/email';
import {
  deleteMail,
  getMessageById,
  markAsUnreadFlow,
} from '../store/thunks/email';
import { Email, ToFrom } from '../store/types';
import { FoldersId } from '../store/types/enums/Folders';
import { updateFolderCountFlow } from '../store/thunks/folders';
import { updateAliasCountFlow } from '../store/thunks/aliases';

export type EmailDetailScreenProps = NativeStackScreenProps<
  RootStackParams,
  'emailDetail'
>;

export const EmailDetailScreen = (props: EmailDetailScreenProps) => {
  const { emailId, isUnread } = props.route.params; // we need stored email to check if it was unread, getMessageById automatically marks it as read on backend;
  const [email, setEmail] = useState<Email>();
  const [loading, setLoading] = useState(false);
  const isTrash = useAppSelector(state =>
    selectMailByFolder(state, FoldersId.trash, 'all', emailId),
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
    if (email) {
      dispatch(markAsUnreadFlow({ email: email }));
      props.navigation.goBack();
    }
  };

  useEffect(() => {
    const fetchMail = async () => {
      setLoading(true);
      try {
        const resp = await dispatch(getMessageById({ id: emailId })).unwrap();
        setEmail(resp);
      } catch (e) {
        // ignore
      }
      setLoading(false);
    };
    fetchMail();
  }, []);

  useLayoutEffect(() => {
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
  }, [props.navigation, email?.emailId]);

  useEffect(() => {
    if (isUnread) {
      if (email?.folderId === FoldersId.aliases) {
        if (email.aliasId) {
          dispatch(updateAliasCountFlow({ id: email.aliasId, amount: -1 }));
        }
      } else {
        if (email?.folderId) {
          dispatch(
            updateFolderCountFlow({
              id: email.folderId.toString(),
              amount: -1,
            }),
          );
        }
      }
    }
  }, [email?.unread]);

  if (!email) {
    if (loading) {
      return (
        <View style={{ margin: spacing.lg }}>
          <ActivityIndicator color={colors.primaryBase} />
        </View>
      );
    }
    return (
      <View>
        <Text>Message doesn't exist</Text>
      </View>
    );
  }

  const fromArray = email?.fromJSON
    ? (JSON.parse(email.fromJSON) as Array<ToFrom>)
    : undefined;
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
          <Text>{from?.name || from?.address}</Text>
          <Text>{fullDateText}</Text>
        </View>
        <View style={{ marginTop: spacing.lg }}>
          <Text style={fonts.regular.regular}>{email.bodyAsText}</Text>
        </View>
      </View>
    </ScrollView>
  );
};
