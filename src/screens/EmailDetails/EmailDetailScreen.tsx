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
  Linking,
} from 'react-native';
import { RootStackParams } from '../../Navigator';
import { colors } from '../../util/colors';
import { useAppDispatch } from '../../hooks';
import { fonts } from '../../util/fonts';
import { NavIconButton } from '../../components/NavIconButton';
import {
  deleteMailFromTrash,
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
import WebView from 'react-native-webview';

export type EmailDetailScreenProps = NativeStackScreenProps<
  RootStackParams,
  'emailDetail'
>;

const injectedJavaScript = `
    const meta = document.createElement('meta');
    meta.setAttribute('content', 'width=width, initial-scale=0.5, maximum-scale=0.5, user-scalable=0');
    meta.setAttribute('name', 'viewport');
    document.getElementsByTagName('head')[0].appendChild(meta);
    (function() {
     let body = document.getElementsByTagName("BODY")[0];
      body.style.fontFamily = "Arial, sans-serif";
      body.style.fontSize = "16px";
      body.style.color = "#575757";
      body.style.lineHeight = "1.5";
      document.getElementsByTagName("DIV")[0].style.fontSize = "30px";
    })();
  `;

export const EmailDetailScreen = (props: EmailDetailScreenProps) => {
  const { emailId, isUnread, isTrash } = props.route.params; // we need stored email to check if it was unread, getMessageById automatically marks it as read on backend;
  const [email, setEmail] = useState<Email>();
  const [loading, setLoading] = useState(false);

  const fromArray = email?.fromJSON
    ? (JSON.parse(email.fromJSON) as Array<ToFrom>)
    : undefined;
  const from = fromArray?.[0];

  const { openModal, onReply, actionsModal } = useInboxActions({
    to: email?.toJSON ? JSON.parse(email.toJSON) : undefined,
    from: from?.address,
    subject: email?.subject,
  });

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
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete mail',
      });
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
      headerShadowVisible: false,
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
          <View style={styles.rowDirectionCentered}>
            <Avatar
              variant="extraSmall"
              displayName={from?.name}
              email={from?.address}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.senderName}>
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
          <WebView
            originWhitelist={['*']}
            source={{ html: email.bodyAsHtml }}
            scalesPageToFit
            injectedJavaScript={injectedJavaScript}
            style={[styles.bodyContainer]}
            showsVerticalScrollIndicator={false}
            onShouldStartLoadWithRequest={request => {
              if (request.url !== 'about:blank') {
                if (request.url.startsWith('mailto:')) {
                  props.navigation.navigate('compose', {
                    to: [request.url.replace('mailto:', '')],
                  });
                } else {
                  Linking.openURL(request.url);
                }
                return false;
              } else {
                return true;
              }
            }}
          />
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
