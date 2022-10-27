import React from 'react';
import { Text, Pressable, ImageBackground } from 'react-native';

import { Icon } from '../../../components/Icon';
import { colors } from '../../../util/colors';
import images from '../../../assets/images';
import { NavIconButton } from '../../../components/NavIconButton';
import Avatar from '../../../components/Avatar/Avatar';
import styles from './styles';

type ContactHeaderProps = {
  navigation: any;
  isEditing?: boolean;
  onPressEdit?: () => void;
  avatar?: string;
  email?: string;
  name?: string;
};

export const ContactHeader = ({
  navigation,
  isEditing,
  avatar,
  email,
  name,
  onPressEdit,
}: ContactHeaderProps) => {
  return (
    <ImageBackground
      source={images.contactCoverPhoto}
      style={styles.container}
      resizeMode="center">
      <NavIconButton
        icon={{ name: 'chevron-back', size: 32, color: colors.secondaryBase }}
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      />
      <Avatar
        variant={'large'}
        image={avatar}
        style={styles.avatar}
        email={email}
        displayName={name}
        onPress={() => {}}
      />
      {!isEditing && (
        <Pressable style={styles.editButton} onPress={() => onPressEdit?.()}>
          <Icon name={'create-outline'} size={24} color={colors.white} />
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      )}
    </ImageBackground>
  );
};
