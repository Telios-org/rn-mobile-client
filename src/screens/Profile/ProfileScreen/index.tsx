import React, { useLayoutEffect, useRef, useState } from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Keyboard,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

import { MainStackParams, RootStackParams } from '../../../Navigator';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { accountLogout } from '../../../store/thunks/accountLogout';

import { selectMailBoxAddress } from '../../../store/selectors/email';
import {
  selectAccountDisplayName,
  selectAccountAvatar,
  selectAccountId,
  selectUserPlan,
} from '../../../store/selectors/account';
import { accountUpdate } from '../../../store/thunks/account';

import { NavIconButton } from '../../../components/NavIconButton';
import { TableCell } from '../../../components/TableCell';
import Avatar from '../../../components/Avatar/Avatar';
import { Input } from '../../../components/Input';

import { menuItems, launchImageErrorMessages } from './constants';
import { spacing } from '../../../util/spacing';
import { colors } from '../../../util/colors';
import styles from './styles';

export type ProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'profile'>,
  NativeStackScreenProps<RootStackParams>
>;

export const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const accountDisplayName = useAppSelector(selectAccountDisplayName);
  const accountAvatar = useAppSelector(selectAccountAvatar);
  const accountId = useAppSelector(selectAccountId);
  const userPlan = useAppSelector(selectUserPlan);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isImagePreparing, setIsImagePreparing] = useState<boolean>(false);
  const inputRefVerify = useRef<TextInput>(null);

  const dispatch = useAppDispatch();
  const [displayName, setDisplayName] = useState<string>(
    accountDisplayName || '',
  );
  const mailboxAddress = useAppSelector(selectMailBoxAddress);
  const [avatar, setAvatar] = useState<string>(accountAvatar || '');

  const userPlanText = `${userPlan} Member`;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerLeft: () => (
        <NavIconButton
          icon={{ name: 'menu-outline' }}
          onPress={() => navigation.openDrawer()}
        />
      ),
      headerRight: () => (
        <View>
          {!isEditing && (
            <NavIconButton
              icon={{
                name: 'create-outline',
              }}
              onPress={() => setIsEditing(prev => !prev)}
              padRight
            />
          )}
        </View>
      ),
    });
  }, [navigation, isEditing]);

  const onLogout = () => {
    dispatch(accountLogout());
  };

  const updateProfile = () => {
    if (accountId) {
      dispatch(
        accountUpdate({
          accountId: accountId,
          displayName: displayName,
          avatar: avatar,
        }),
      );
    } else {
      Alert.alert('Warning', 'An error occurred. Please try again later.');
    }
    setIsEditing(false);
  };

  const startProfileEdit = () => {
    setIsEditing(true);
  };

  const selectImage = async () => {
    try {
      setIsImagePreparing(true);
      const result = await launchImageLibrary({
        includeBase64: true,
        mediaType: 'photo',
      });
      if (!result.didCancel) {
        const imageBase64 = `data:image/png;base64,${result.assets?.[0]?.base64}`;
        setAvatar(imageBase64);
      } else if (result.errorCode) {
        const errorMessage =
          launchImageErrorMessages[result.errorCode] ||
          launchImageErrorMessages.default;
        Alert.alert('Warning', errorMessage);
      }
      setIsImagePreparing(false);
    } catch (error) {
      Alert.alert('Warning', launchImageErrorMessages.default);
    }
  };

  const handleCancelAcion = () => {
    setDisplayName(accountDisplayName || '');
    setAvatar(accountAvatar || '');
    setIsEditing(false);
    setIsImagePreparing(false);
  };

  const goToScreen = screenName => {
    if (!screenName) return;
    navigation.navigate(screenName);
  };

  const onPressMenuItem = screenName => {
    if (screenName === 'login') {
      onLogout();
    } else {
      goToScreen(screenName);
    }
  };
  const optionItemRender = ({
    icon = '',
    key,
    screenName,
    label,
    style = {},
  }) => (
    <TableCell
      label={label}
      key={key}
      onPress={() => onPressMenuItem(screenName)}
      iconLeft={{
        name: icon,
        color: colors.inkDarkest,
        size: 24,
      }}
      iconRight={{
        name: 'chevron-forward-outline',
        color: colors.inkDarkest,
        size: 24,
      }}
      style={{
        paddingVertical: spacing.md,
        ...style,
      }}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollViewContainer}>
        <Pressable
          onPress={() => isEditing && Keyboard.dismiss()}
          style={styles.flex1}>
          <View style={styles.content}>
            <View>
              <Avatar
                variant={'large'}
                image={avatar}
                style={styles.avatar}
                email={mailboxAddress}
                editable={isEditing}
                displayName={displayName}
                isLoading={isImagePreparing}
                onPress={() => selectImage()}
              />
              {isEditing ? (
                <Input
                  ref={inputRefVerify}
                  value={displayName}
                  onChangeText={text => setDisplayName(text)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              ) : (
                <Pressable onPress={() => startProfileEdit()}>
                  <Text style={styles.displayName}>{displayName}</Text>
                </Pressable>
              )}

              <Text style={styles.mailbox}>{mailboxAddress}</Text>

              {!isEditing && userPlan && (
                <View style={styles.userStatus}>
                  <Text style={styles.userStatusText}>{userPlanText}</Text>
                </View>
              )}
            </View>
            <View>
              {isEditing && (
                <View style={styles.actionContainer}>
                  <Pressable
                    onPress={() => handleCancelAcion()}
                    style={styles.cancelButton}>
                    <Text style={styles.cancelText}>{'Cancel'}</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => updateProfile()}
                    style={styles.saveButton}>
                    <Text style={styles.saveText}>{'Save'}</Text>
                  </Pressable>
                </View>
              )}
              {menuItems.map(item => optionItemRender(item))}
            </View>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};
