import React from 'react';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useAppSelector } from '../../hooks';
import { Image, Text, View } from 'react-native';
import { IconButton } from '../IconButton';
import { colors } from '../../util/colors';
import { fonts } from '../../util/fonts';
import { Avatar } from '../Avatar';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DrawerCell } from '../DrawerCell/DrawerCell';
import DrawerAliasesSection from '../DrawerAliasesSection/DrawerAliasesSection';
import styles from './styles';

export const DrawerContent = (props: DrawerContentComponentProps) => {
  const mail = useAppSelector(state => state.mail);
  const selectedRoute = props.state.routes[props.state.index];

  const onRefresh = () => {
    //todo
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
            <Text style={fonts.small.regular}>{mail.mailbox?.address}</Text>
          </View>
          <Avatar touchable={true} />
        </View>
      </TouchableOpacity>
      <View style={styles.drawerContainer}>
        <DrawerCell
          label="Inbox"
          focused={selectedRoute.name === 'inbox'}
          leftIcon={{ name: 'mail-outline' }}
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
