import React from 'react';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Image, StyleProp, Text, View, ViewStyle } from 'react-native';
import { IconButton } from './IconButton';
import { colors } from '../util/colors';
import { borderRadius, spacing } from '../util/spacing';
import { fonts, textStyles } from '../util/fonts';
import { Avatar } from './Avatar';
import { Icon } from './Icon';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const DrawerContent = (props: DrawerContentComponentProps) => {
  const mainState = useAppSelector(state => state.main);

  const onRefresh = () => {
    //todo
  };

  const onManageAliases = () => {};

  const onAddAlias = () => {};

  const selectedRoute = props.state.routes[props.state.index];
  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          flexDirection: 'row',
          height: 60,
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: spacing.md,
        }}>
        <Image
          source={{ uri: 'logo-horizontal' }}
          style={{ width: '50%' }}
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
        style={{
          marginTop: spacing.md,
          paddingHorizontal: spacing.sm,
        }}>
        <View
          style={{
            flexDirection: 'row',
            height: 50,
            borderRadius: borderRadius,
            backgroundColor:
              selectedRoute.name === 'profile' ? colors.skyLighter : null,
            paddingHorizontal: spacing.sm,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{ flex: 1 }}>
            <Text style={fonts.small.regular}>
              {mainState.mailbox?.address}
            </Text>
          </View>
          <Avatar touchable={true} />
        </View>
      </TouchableOpacity>
      <View style={{ marginTop: spacing.lg }}>
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
      <View
        style={{
          marginTop: spacing.lg,
          marginHorizontal: spacing.md,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={fonts.title3}>{'Aliases'}</Text>
        <IconButton
          onPress={onManageAliases}
          name="options-outline"
          color={colors.primaryBase}
          style={{ paddingLeft: spacing.lg }}
        />
      </View>
      <View style={{ marginTop: spacing.xs }}>
        <DrawerCell
          label="Add Alias"
          rightIcon={{ name: 'add-outline', color: colors.primaryBase }}
          onPress={onAddAlias}
        />
      </View>
    </DrawerContentScrollView>
  );
};

type IconAccessory = { name: string; color?: string; size?: number };

const DrawerCell = (props: {
  label: string;
  focused?: boolean;
  leftIcon?: IconAccessory;
  rightIcon?: IconAccessory;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <TouchableOpacity
      style={[
        {
          paddingHorizontal: spacing.sm,
        },
        props.style,
      ]}
      onPress={props.onPress}>
      <View
        style={{
          flexDirection: 'row',
          height: 45,
          borderRadius: borderRadius,
          backgroundColor: props.focused ? colors.skyLighter : null,
          paddingHorizontal: spacing.sm,
          alignItems: 'center',
        }}>
        {props.leftIcon && (
          <View
            style={{
              width: 50,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Icon
              name={props.leftIcon.name}
              size={props.leftIcon.size || 28}
              color={
                props.leftIcon.color || props.focused
                  ? colors.inkDarkest
                  : colors.inkLight
              }
            />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text
            style={[
              fonts.regular.regular,
              {
                color: props.focused ? colors.inkDarkest : colors.inkLight,
                fontWeight: props.focused
                  ? textStyles.weights.bold
                  : textStyles.weights.regular,
              },
            ]}>
            {props.label}
          </Text>
        </View>
        {props.rightIcon && (
          <View
            style={{
              width: 45,
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <Icon
              name={props.rightIcon.name}
              size={props.rightIcon.size || 24}
              color={props.rightIcon.color || colors.inkDarkest}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
