import React, { useRef } from 'react';
import { Modalize } from 'react-native-modalize';
import {
  StyleSheet,
  Text,
  StyleProp,
  TextStyle,
  Pressable,
} from 'react-native';
import { Icon, IconProps } from '../components/Icon';
import { colors } from '../util/colors';
import { fonts } from '../util/fonts';
import { Portal } from 'react-native-portalize';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/core/src/types';
import { RootStackParams } from '../navigators/Navigator';
import { Attachment } from '../store/types';

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  modal: {
    paddingVertical: 50,
    paddingBottom: 50,
    paddingHorizontal: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  overlayStyle: {
    backgroundColor: '#090A0A70',
  },
});
interface ActionRowProps {
  name: string;
  iconProps?: IconProps;
  onPress?: () => void;
  titleStyle?: StyleProp<TextStyle>;
}

const ActionRow = ({
  name,
  iconProps,
  titleStyle,
  onPress,
}: ActionRowProps) => {
  return (
    <Pressable style={styles.rowContainer} onPress={onPress}>
      <Text
        style={[
          fonts.regular.regular,
          { color: colors.inkDarkest },
          titleStyle,
        ]}>
        {name}
      </Text>
      {iconProps && <Icon {...iconProps} />}
    </Pressable>
  );
};

interface InboxActionsProps {
  to?: string[];
  from?: string;
  cc?: string[];
  bcc?: string[];
  bodyAsText?: string;
  bodyAsHTML?: string;
  subject?: string;
  attachments?: Attachment[];
}

export default ({
  to,
  from,
  cc,
  bcc,
  bodyAsHTML,
  subject,
  attachments,
}: InboxActionsProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const modalizeRef = useRef<Modalize>();
  const openModal = () => {
    modalizeRef.current?.open();
  };
  const closeModal = () => {
    modalizeRef.current?.close();
  };

  const onReply = () => {
    closeModal();
    navigation.navigate('compose', {
      to,
      from,
      subject: `Re: ${subject}`,
      bodyAsHTML: `<div>---- Original message ----</div>${bodyAsHTML}`,
      attachments,
    });
  };

  const onReplyAll = () => {
    closeModal();
    navigation.navigate('compose', {
      to,
      from,
      cc,
      bcc,
      subject: `Re: ${subject}`,
      bodyAsHTML: `<div>---- Original message ----</div>${bodyAsHTML}`,
      attachments,
    });
  };

  const onForward = () => {
    closeModal();
    navigation.navigate('compose', {
      from,
      subject: `Fwd: ${subject}`,
      bodyAsHTML: `<div>---- Original message ----</div>${bodyAsHTML}`,
      attachments,
    });
  };

  const actions: ActionRowProps[] = [
    {
      name: 'Reply All',
      iconProps: {
        name: 'return-up-back',
        color: colors.inkDarkest,
        size: 24,
      },
      onPress: onReplyAll,
    },
    {
      name: 'Forward',
      iconProps: {
        name: 'return-up-forward',
        color: colors.inkDarkest,
        size: 24,
      },
      onPress: onForward,
    },
    {
      name: 'Cancel',
      titleStyle: {
        color: colors.inkLight,
      },
      onPress: closeModal,
    },
  ];

  const actionsModal = (
    <Portal>
      <Modalize
        ref={modalizeRef}
        handlePosition="inside"
        childrenStyle={styles.modal}
        overlayStyle={styles.overlayStyle}
        adjustToContentHeight>
        {actions.map(actionProps => (
          <ActionRow key={actionProps.name} {...actionProps} />
        ))}
      </Modalize>
    </Portal>
  );
  return {
    openModal,
    closeModal,
    onReply,
    actionsModal,
  };
};
