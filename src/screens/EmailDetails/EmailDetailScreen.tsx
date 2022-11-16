import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
} from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';
import {
  ActivityIndicator,
  ScrollView,
  Pressable,
  Text,
  View,
} from 'react-native';
import { RootStackParams } from '../../navigators/Navigator';
import { colors } from '../../util/colors';
import { useAppDispatch } from '../../hooks';
import { fonts } from '../../util/fonts';
import { NavIconButton } from '../../components/NavIconButton';
import {
  deleteMailFromFolder,
  getMessageById,
  markAsUnreadFlow,
  moveMailToTrash,
} from '../../store/thunks/email';
import Avatar from '../../components/Avatar/Avatar';
import { Email, ToFrom } from '../../store/types';
import { decrementFolderCounter } from '../../store/thunks/folders';
import useInboxActions from '../../hooks/useInboxActions';
import { Icon } from '../../components/Icon';
import styles from './styles';
import BodyWebView from '../../components/BodyWebView';
import { FoldersId } from '../../store/types/enums/Folders';
import { showToast } from '../../util/toasts';

export type EmailDetailScreenProps = NativeStackScreenProps<
  RootStackParams,
  'emailDetail'
>;

export const EmailDetailScreen = ({
  route,
  navigation,
}: EmailDetailScreenProps) => {
  const { emailId, isUnread, folderId } = route.params; // we need stored email to check if it was unread, getMessageById automatically marks it as read on backend;
  const [email, setEmail] = useState<Email>();
  const [loading, setLoading] = useState(false);
  const showMarkAsUnread =
    folderId === FoldersId.inbox || folderId === FoldersId.aliases;
  const fromArray = email?.fromJSON
    ? (JSON.parse(email.fromJSON) as Array<ToFrom>)
    : undefined;
  const from = fromArray?.[0];
  const to = email?.toJSON ? JSON.parse(email.toJSON)[0].address : undefined;
  const shouldSwapFromTo =
    folderId !== FoldersId.sent && folderId !== FoldersId.drafts;
  let toRecipients: string[] = [];
  if (shouldSwapFromTo) {
    if (from?.address) {
      toRecipients = [from.address];
    }
  } else {
    if (to) {
      toRecipients = [to];
    }
  }
  const fromRecipients = shouldSwapFromTo ? to : from?.address;

  const { openModal, onReply, actionsModal } = useInboxActions({
    to: toRecipients,
    from: fromRecipients,
    subject: email?.subject,
    cc: email?.ccJSON
      ? (JSON.parse(email.ccJSON) as Array<ToFrom>).map(cc => cc.address)
      : undefined,
    bcc: email?.bccJSON
      ? (JSON.parse(email.bccJSON) as Array<ToFrom>).map(bcc => bcc.address)
      : undefined,
    bodyAsHTML: email?.bodyAsHtml,
  });

  const dispatch = useAppDispatch();

  const onDelete = useCallback(async () => {
    try {
      if (folderId === FoldersId.inbox) {
        if (email) {
          await dispatch(moveMailToTrash({ messages: [email] })).unwrap();
          Toast.show({
            type: 'info',
            text1: 'Email moved to trash',
          });
          navigation.goBack();
        }
      } else {
        await dispatch(
          deleteMailFromFolder({
            messageIds: [emailId],
            folderId,
          }),
        );
        navigation.goBack();
      }
    } catch (e) {
      showToast('error', 'Failed to delete mail');
    }
  }, [email?.emailId]);

  const onToggleUnread = () => {
    if (email) {
      dispatch(markAsUnreadFlow({ email: email }));
      navigation.goBack();
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
    navigation.setOptions({
      headerShadowVisible: false,
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          {showMarkAsUnread && (
            <NavIconButton
              icon={{
                name: 'mail-unread-outline',
              }}
              onPress={onToggleUnread}
              padLeft
            />
          )}
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
  }, [navigation, email?.emailId, onDelete]);

  useEffect(() => {
    if (isUnread && email) {
      dispatch(decrementFolderCounter({ email }));
    }
  }, [email?.unread]);

  if (!email) {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
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

  const dayFormatted = format(new Date(email.date), 'dd MMM yyyy');
  const timeFormatted = format(new Date(email.date), 'p');
  const fullDateText = `${dayFormatted} at ${timeFormatted}`;

  return (
    <>
      <View style={styles.container}>
        <Text style={fonts.title3}>{email.subject}</Text>
        <View style={[styles.rowDirectionCentered, styles.senderContainer]}>
          <View style={[styles.rowDirectionCentered, styles.flex1]}>
            <Avatar
              variant="extraSmall"
              displayName={from?.name}
              email={from?.address}
              style={styles.avatar}
            />
            <View style={styles.flex1}>
              <Text style={styles.senderName} numberOfLines={1}>
                {from?.name || from?.address}
              </Text>
              <Text style={styles.receiveDate}>{fullDateText}</Text>
            </View>
          </View>
          <View style={styles.rowDirectionCentered}>
            <Pressable style={styles.replyBtn} onPress={onReply}>
              <Icon name="return-up-back" size={24} color={colors.inkDarkest} />
            </Pressable>
            <Pressable onPress={openModal}>
              <Icon
                name="ellipsis-horizontal"
                size={24}
                color={colors.inkDarkest}
              />
            </Pressable>
          </View>
        </View>
        {email.bodyAsHtml ? (
          <BodyWebView bodyAsHtml={email.bodyAsHtml} />
        ) : (
          <ScrollView
            style={styles.bodyContainer}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.bodyText}>{email.bodyAsText}</Text>
          </ScrollView>
        )}
      </View>
      {actionsModal}
    </>
  );
};
