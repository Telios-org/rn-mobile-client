import React from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import isString from 'lodash/isString';
import { MainStackParams, RootStackParams } from '../../navigators/Navigator';
import MailContainer from '../../components/MailContainer';
import { selectAllMailsByFolder } from '../../store/selectors/email';
import {
  deleteMailFromFolder,
  getAllMailByFolder,
} from '../../store/thunks/email';
import { FoldersId } from '../../store/types/enums/Folders';
import { Email, ToFrom } from '../../store/types';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { showToast } from '../../util/toasts';

export type DraftsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'drafts'>,
  NativeStackScreenProps<RootStackParams>
>;

export const DraftsScreen = ({ navigation }: DraftsScreenProps) => {
  const dispatch = useAppDispatch();
  const draftsMails = useAppSelector(state =>
    selectAllMailsByFolder(state, FoldersId.drafts),
  );

  const onSelectEmail = (emailId: string) => {
    const selectedDraftMail = draftsMails.find(
      item => item.emailId === emailId,
    );

    if (selectedDraftMail) {
      const from =
        selectedDraftMail.fromJSON &&
        JSON.parse(selectedDraftMail.fromJSON)?.[0]?.address;
      navigation.navigate('compose', {
        to:
          selectedDraftMail.toJSON &&
          JSON.parse(selectedDraftMail.toJSON)?.map(
            (item: ToFrom) => item.address,
          ),
        from,
        subject: selectedDraftMail.subject,
        bodyAsText: selectedDraftMail.bodyAsText,
        bodyAsHTML: selectedDraftMail.bodyAsHtml,
        cc:
          selectedDraftMail.ccJSON &&
          JSON.parse(selectedDraftMail.ccJSON)?.map(
            (item: ToFrom) => item.address,
          ),
        bcc:
          selectedDraftMail.bccJSON &&
          JSON.parse(selectedDraftMail.bccJSON)?.map(
            (item: ToFrom) => item.address,
          ),
        attachments:
          selectedDraftMail.attachments &&
          isString(selectedDraftMail.attachments)
            ? JSON.parse(selectedDraftMail.attachments)
            : selectedDraftMail.attachments,
      });
    }
  };

  const onDeleteEmail = async (email: Email) => {
    try {
      await dispatch(
        deleteMailFromFolder({
          messageIds: [email.emailId],
          folderId: FoldersId.drafts,
        }),
      );
    } catch (e: any) {
      showToast('error', e.message);
    }
  };

  return (
    <MailContainer
      title="Drafts"
      showBottomSeparator
      showRecipient={true}
      mails={draftsMails}
      getMoreData={async (offset, perPage) =>
        await dispatch(
          getAllMailByFolder({ id: FoldersId.drafts, offset, limit: perPage }),
        ).unwrap()
      }
      onPressItem={onSelectEmail}
      onRightActionPress={onDeleteEmail}
    />
  );
};
