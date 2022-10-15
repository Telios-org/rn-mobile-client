import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { RootStackParams } from '../Navigator';
import { spacing } from '../util/spacing';
import { colors } from '../util/colors';
import { useAppDispatch } from '../hooks';
import { fonts } from '../util/fonts';
import { NavIconButton } from '../components/NavIconButton';
import {
  deleteMailFromTrash,
  getMessageById,
  markAsUnreadFlow,
  moveMailToTrash,
} from '../store/thunks/email';
import { Email, ToFrom } from '../store/types';
import { decrementFolderCounter } from '../store/thunks/folders';
import Toast from 'react-native-toast-message';

export type EmailDetailScreenProps = NativeStackScreenProps<
  RootStackParams,
  'emailDetail'
>;

export const EmailDetailScreen = (props: EmailDetailScreenProps) => {
  const { emailId, isUnread, isTrash } = props.route.params; // we need stored email to check if it was unread, getMessageById automatically marks it as read on backend;
  const [email, setEmail] = useState<Email>();
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const onDelete = useCallback(async () => {
    try {
      if (isTrash) {
        // permanently delete if already in trash
        await dispatch(
          deleteMailFromTrash({
            messageIds: [emailId],
          }),
        );
        props.navigation.goBack();
      } else {
        if (email) {
          await dispatch(moveMailToTrash({ messages: [email] })).unwrap();
          Toast.show({
            type: 'info',
            text1: 'Email moved to trash',
          });
          props.navigation.goBack();
        }
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to delete mail');
    }
  }, [email?.emailId]);

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
          {!isTrash && (
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
  }, [props.navigation, email?.emailId, onDelete]);

  useEffect(() => {
    if (isUnread && email) {
      dispatch(decrementFolderCounter({ email }));
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
