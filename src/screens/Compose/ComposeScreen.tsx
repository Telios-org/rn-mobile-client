import React, { useLayoutEffect, useRef, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { formatISO } from 'date-fns';
import {
  Alert,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { RootStackParams } from '../../navigators/Navigator';
import { colors } from '../../util/colors';
import { useAppDispatch } from '../../hooks';
import { NavIconButton } from '../../components/NavIconButton';
import { saveDraft, sendEmail } from '../../store/thunks/email';
import { EmailContent } from '../../store/types';
import styles from './styles';
import useFromInput from './components/FromDropdown/useFromInput';
import useToInput from './components/ToRecipient/useToInput';
import useSubjectInput from './components/SubjectField/useSubjectInput';
import useAttachments from './components/useAttachments';
import BodyContent from './components/BodyContent';
import { showToast } from '../../util/toasts';

export type ComposeScreenProps = NativeStackScreenProps<
  RootStackParams,
  'compose'
>;

export const ComposeScreen = (props: ComposeScreenProps) => {
  const initialFrom = props.route.params?.from;
  const initialTo = props.route.params?.to;
  const initialBcc = props.route.params?.bcc;
  const initialCc = props.route.params?.cc;
  const initialBodyAsHtml = props.route.params?.bodyAsHTML;
  const initialBodyAsText = props.route.params?.bodyAsText;
  const initialSubject = props.route.params?.subject;
  const initialAttachments = props.route.params?.attachments;
  const dispatch = useAppDispatch();
  const bodyInputRef = useRef<TextInput>(null);
  const [bodyAsText, setBodyAsText] = useState(initialBodyAsText || '');
  let bodyAsHTMLRef = useRef(initialBodyAsHtml);
  const { from, fromInput } = useFromInput(initialFrom, styles.rowContainer);
  const { to, toInputs, cc, bcc } = useToInput(
    initialTo,
    initialBcc,
    initialCc,
    styles.rowContainer,
  );
  const { subject, subjectInput } = useSubjectInput(
    initialSubject,
    styles.rowContainer,
    () => {
      bodyInputRef.current?.focus();
    },
  );
  const { attachments, attachmentsTags, attachmentIcon } =
    useAttachments(initialAttachments);
  const [isSending, setIsSending] = useState(false);

  const onSaveDraft = async () => {
    try {
      const saveResponse = await dispatch(
        saveDraft({
          from: [{ address: from }],
          to: to.map(address => ({ address })),
          cc: cc.map(address => ({ address })),
          bcc: bcc.map(address => ({ address })),
          subject: subject,
          date: formatISO(Date.now()),
          bodyAsText,
          bodyAsHtml: bodyAsHTMLRef.current,
        }),
      );

      if (saveResponse.type === saveDraft.fulfilled.type) {
        showToast('info', 'Draft saved');
      }
    } catch (e) {
      showToast('error', 'Failed to save draft');
    }
  };

  const onClose = () => {
    const shouldPromptSaveDraft = to || subject || bodyAsText;
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
    if (!from || isSending) {
      Alert.alert(
        'Error',
        `missing one of: to-${to} sub-${subject} body-${bodyAsText} mailbox-${!!from} isSending-${isSending}`,
      );
      return;
    }
    setIsSending(true);

    const email: EmailContent = {
      from: [{ address: from }],
      to: to.map(address => ({ address })),
      date: formatISO(new Date()),
      cc: cc.map(address => ({ address })),
      bcc: bcc.map(address => ({ address })),
      subject: subject,
      bodyAsText,
      bodyAsHtml: bodyAsHTMLRef.current,
      attachments,
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

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <NavIconButton
          icon={{ name: 'close-outline', size: 28 }}
          onPress={onClose}
          padRight
        />
      ),
      headerRight: () => (
        <View style={styles.flexRow}>
          {attachmentIcon}
          <NavIconButton
            icon={{
              name: 'send-outline',
              color: to.length < 1 ? colors.skyBase : colors.primaryBase,
              size: 22,
            }}
            onPress={onSend}
            loading={isSending}
            disabled={to.length < 1}
            padLeft
          />
        </View>
      ),
    });
  }, [
    to,
    cc,
    bcc,
    from,
    attachments,
    bodyAsHTMLRef.current,
    subject,
    isSending,
  ]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.main}>
        {fromInput}
        {toInputs}
        {subjectInput}
        {attachmentsTags}
        <BodyContent
          initialBodyAsText={bodyAsText}
          bodyAsHtml={initialBodyAsHtml}
          onEndEditing={setBodyAsText}
          onHTMLChange={html => (bodyAsHTMLRef.current = html)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
