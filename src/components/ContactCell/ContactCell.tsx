import React from 'react';
import { Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import { fonts } from '../../util/fonts';
import Avatar from '../Avatar/Avatar';
import { styles } from './styles';

type ContactCellProps = {
  email?: string;
  name?: string;
  avatar?: string;
  onPress?: () => void;
};

const ContactCell = ({ email, name, avatar, onPress }: ContactCellProps) => {
  return (
    <RectButton onPress={onPress} style={styles.container}>
      <Avatar
        variant={'small'}
        image={avatar}
        style={styles.avatar}
        email={email}
        displayName={name}
        onPress={() => onPress?.()}
      />
      <View style={styles.flex1}>
        <View style={styles.row}>
          <Text style={fonts.regular.bold}>{name}</Text>
        </View>
        <Text style={styles.subject}>{email}</Text>
      </View>
    </RectButton>
  );
};

export default ContactCell;
