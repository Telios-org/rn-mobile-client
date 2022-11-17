import React from 'react';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Image, Text, View } from 'react-native';
import { IconButton } from '../IconButton';
import { colors } from '../../util/colors';
import Avatar from '../Avatar/Avatar';
import DrawerAliasesSection from '../DrawerAliasesSection/DrawerAliasesSection';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DrawerCell } from '../DrawerCell/DrawerCell';
import {
  selectMailBoxAddress,
  selectMailBoxId,
} from '../../store/selectors/email';
import { folderSelectors } from '../../store/adapters/folders';
import { FoldersId } from '../../store/types/enums/Folders';
import { getMailboxFolders, getNewMailFlow } from '../../store/thunks/email';
import styles from './styles';
import {
  selectAccountAvatar,
  selectAccountDisplayName,
} from '../../store/selectors/account';

export const DrawerContent = (props: DrawerContentComponentProps) => {
  const dispatch = useAppDispatch();
  const mailboxAddress = useAppSelector(selectMailBoxAddress);
  const displayName = useAppSelector(selectAccountDisplayName);
  const avatar = useAppSelector(selectAccountAvatar);
  const mailboxId = useAppSelector(selectMailBoxId);
  const selectedRoute = props.state.routes[props.state.index];
  const folders = useAppSelector(state =>
    folderSelectors.selectEntities(state.folders),
  );

  const getFolderUnreadCount = (folderId: number): string | undefined => {
    if (folders) {
      const folder = folders[folderId];
      if (folder && folder.count > 0) {
        return folder.count.toString();
      }
    }
    return undefined;
  };

  const onRefresh = async () => {
    await dispatch(getNewMailFlow());
    if (mailboxId) {
      await dispatch(getMailboxFolders({ id: mailboxId }));
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'logo-horizontal' }}
          style={styles.logo}
          resizeMode={'contain'}
        />
        <IconButton
          name="refresh-outline"
          color={colors.primaryBase}
          onPress={onRefresh}
        />
      </View>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('profile')}
        style={styles.profileBtn}>
        <View
          style={[
            styles.profileBtnContent,
            {
              backgroundColor:
                selectedRoute.name === 'profile'
                  ? colors.skyLighter
                  : undefined,
            },
          ]}>
          <View style={styles.profileAddress}>
            {!!displayName && (
              <Text style={styles.displayName}>{displayName}</Text>
            )}
            <Text style={styles.mailbox}>{mailboxAddress}</Text>
          </View>
          <Avatar
            email={mailboxAddress}
            displayName={displayName}
            image={avatar}
          />
        </View>
      </TouchableOpacity>
      <View style={styles.drawerContainer}>
        <DrawerCell
          label="Inbox"
          focused={selectedRoute.name === 'inbox'}
          leftIcon={{ name: 'mail-outline' }}
          rightText={getFolderUnreadCount(FoldersId.inbox)}
          onPress={() => props.navigation.navigate('inbox')}
        />

        <DrawerCell
          label="Drafts"
          focused={selectedRoute.name === 'drafts'}
          leftIcon={{ name: 'create-outline' }}
          onPress={() => props.navigation.navigate('drafts')}
        />
        <DrawerCell
          label="Sent"
          focused={selectedRoute.name === 'sent'}
          leftIcon={{ name: 'send-outline', size: 24 }}
          onPress={() => props.navigation.navigate('sent')}
        />
        <DrawerCell
          label="Trash"
          focused={selectedRoute.name === 'trash'}
          leftIcon={{ name: 'trash-outline' }}
          onPress={() => props.navigation.navigate('trash')}
        />
      </View>
      <DrawerAliasesSection
        navigation={props.navigation}
        selectedRoute={selectedRoute}
      />
    </DrawerContentScrollView>
  );
};
