import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { formatISO } from 'date-fns';
import Toast from 'react-native-toast-message';

import { Alert, Text, View } from 'react-native';
import { RootStackParams } from '../Navigator';
import { TextInput } from 'react-native-gesture-handler';
import { spacing } from '../util/spacing';
import { colors } from '../util/colors';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fonts, textStyles } from '../util/fonts';
import { NavIconButton } from '../components/NavIconButton';
import { saveDraft, sendEmail } from '../store/thunks/email';
import { EmailContent } from '../store/types';

export type ComposeScreenProps = NativeStackScreenProps<
  RootStackParams,
  'compose'
>;

export const ComposeScreen = (props: ComposeScreenProps) => {
  const mailState = useAppSelector(state => state.mail);
  const dispatch = useAppDispatch();
  const userEmailAddress = mailState.mailbox?.address;

  const subjectInputRef = React.useRef<TextInput>(null);
  const bodyInputRef = React.useRef<TextInput>(null);

  const [isSending, setIsSending] = React.useState(false);

  const [to, setTo] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [body, setBody] = React.useState('');

  const onSaveDraft = async () => {
    try {
      const saveResponse = await dispatch(
        saveDraft({
          from: [{ address: userEmailAddress }],
          to: [{ address: to }],
          subject: subject,
          date: formatISO(Date.now()),
          bodyAsText: body,
        }),
      );

      if (saveResponse.type === saveDraft.fulfilled.type) {
        Toast.show({
          type: 'info',
          text1: 'Draft Saved',
        });
      }
    } catch (e) {
      console.log('error saving draft', e);
      Alert.alert('Error', 'Failed to save draft');
    }
  };

  const onClose = () => {
    const shouldPromptSaveDraft = to || subject || body;
    if (shouldPromptSaveDraft) {
      Alert.alert('Save Draft', 'Unsaved drafts will be lost', [
        {
          text: 'No',
          onPress: () => {
            props.navigation.goBack();
          },
          style: 'destructive',
        },
        {
          text: 'Save',
          onPress: () => {
            onSaveDraft();
            props.navigation.goBack();
          },
        },
      ]);
    } else {
      props.navigation.goBack();
    }
  };

  const onSend = async () => {
    if (!to || !subject || !body || !mailState.mailbox || isSending) {
      Alert.alert(
        'Error',
        `missing one of: to-${to} sub-${subject} body-${body} mailbox-${!!mailState.mailbox} isSending-${isSending}`,
      );
      return;
    }

    setIsSending(true);

    const email: EmailContent = {
      from: [{ address: mailState.mailbox.address }],
      to: [{ address: to }],
      subject: subject,
      date: formatISO(new Date()),
      cc: [],
      bcc: [],
      bodyAsText: body,
      bodyAsHTML: body,
      attachments: [],
    };

    const response = await dispatch(sendEmail({ email }));

    setIsSending(false);
    if (response.type === sendEmail.rejected.type) {
      const { meta, ...restOfAction } = response;
      Alert.alert('Error', JSON.stringify(restOfAction));
    } else {
      props.navigation.goBack();
    }
  };

  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <NavIconButton
          icon={{ name: 'close-outline', size: 28 }}
          onPress={onClose}
          padRight
        />
      ),
      headerRight: () => (
        <NavIconButton
          icon={{ name: 'send-outline', color: colors.primaryBase, size: 22 }}
          onPress={onSend}
          loading={isSending}
          padLeft
        />
      ),
    });
  }, [props.navigation, to, subject, body, isSending]); // TODO: is this going to cause performance issues?

  console.log(
    `to-${to} sub-${subject} body-${body} mailbox-${!!mailState.mailbox} isSending-${isSending}`,
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: spacing.sm,
          borderBottomColor: colors.skyLight,
          borderBottomWidth: 1,
          paddingHorizontal: spacing.md,
          height: 50,
          alignItems: 'center',
        }}>
        <Text style={fonts.regular.regular}>{'To:'}</Text>
        <TextInput
          autoFocus={true}
          autoCorrect={false}
          autoCapitalize={'none'}
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          multiline={false}
          style={{
            paddingHorizontal: spacing.md,
            height: '100%',
            flex: 1,
            color: textStyles.defaultColor,
            fontSize: textStyles.sizes.regular,
            fontWeight: textStyles.weights.medium,
          }}
          value={to}
          onChangeText={value => setTo(value)}
          returnKeyType="next"
          onSubmitEditing={() => {
            subjectInputRef.current?.focus();
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: spacing.sm,
          borderBottomColor: colors.skyLight,
          borderBottomWidth: 1,
          paddingHorizontal: spacing.md,
          height: 50,
          alignItems: 'center',
        }}>
        <Text style={fonts.regular.regular}>{'Subject:'}</Text>
        <TextInput
          ref={subjectInputRef}
          multiline={false}
          style={{
            paddingHorizontal: spacing.md,
            height: '100%',
            flex: 1,
            color: textStyles.defaultColor,
            fontSize: textStyles.sizes.regular,
            fontWeight: textStyles.weights.medium,
          }}
          value={subject}
          onChangeText={value => setSubject(value)}
          returnKeyType="next"
          onSubmitEditing={() => {
            bodyInputRef.current?.focus();
          }}
        />
      </View>
      <TextInput
        ref={bodyInputRef}
        multiline={true}
        value={body}
        onChangeText={value => setBody(value)}
        style={{
          paddingHorizontal: spacing.md,
          marginVertical: spacing.md,
          backgroundColor: colors.white,
          flex: 1,
          color: textStyles.defaultColor,
          fontSize: textStyles.sizes.regular,
          fontWeight: textStyles.weights.regular,
        }}
      />
    </View>
  );
};
