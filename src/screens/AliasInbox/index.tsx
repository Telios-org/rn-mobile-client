import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../hooks';
// @ts-ignore
import envApi from '../../../env_api.json';
import { MailListHeader } from '../../components/MailListHeader';
import { MainStackParams, RootStackParams } from '../../Navigator';
import { CompositeScreenProps } from '@react-navigation/native';
import {
  getMessagesByAliasId,
  getReadMessagesByAliasId,
  getUnreadMessagesByAliasId,
} from '../../store/thunks/email';
import { FoldersId } from '../../store/types/enums/Folders';
import { aliasSelectors } from '../../store/adapters/aliases';
import { RootState } from '../../store';
import MailWithFiltersContainer from '../../components/MailWithFiltersContainer';
import {
  selectMailsByAliasId,
  selectReadMailsByAliasId,
  selectUnreadMailsByAliasId,
} from '../../store/selectors/email';

export type AliasInboxScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'aliasInbox'>,
  NativeStackScreenProps<RootStackParams>
>;

export const AliasInboxScreen = ({ route }: AliasInboxScreenProps) => {
  const aliasId = route.params.aliasId;
  const dispatch = useAppDispatch();
  const alias = useAppSelector((state: RootState) =>
    aliasSelectors.selectById(state.aliases, aliasId),
  );

  if (!alias) {
    return null;
  }

  return (
    <MailWithFiltersContainer
      folderId={FoldersId.aliases}
      renderTitle={
        <MailListHeader
          title={`# ${alias?.name}`}
          subtitle={`${alias?.aliasId}@${envApi.postfix}`}
          showCurrentStatus
          canCopySubtitle
          isActive={!alias?.disabled}
        />
      }
      allMailSelector={state => selectMailsByAliasId(state, alias.aliasId)}
      readMailSelector={state => selectReadMailsByAliasId(state, alias.aliasId)}
      unreadMailSelector={state =>
        selectUnreadMailsByAliasId(state, alias.aliasId)
      }
      getAllMails={async (offset, perPage) => {
        return await dispatch(
          getMessagesByAliasId({ id: alias.aliasId, offset, limit: perPage }),
        ).unwrap();
      }}
      getUnreadMails={async (offset, perPage) => {
        return await dispatch(
          getReadMessagesByAliasId({
            id: alias.aliasId,
            offset,
            limit: perPage,
          }),
        ).unwrap();
      }}
      getReadMails={async (offset, perPage) => {
        return await dispatch(
          getUnreadMessagesByAliasId({
            id: alias.aliasId,
            offset,
            limit: perPage,
          }),
        ).unwrap();
      }}
    />
  );
};
