import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import React from 'react';
import { ProfileStackParams } from './Navigator';
import SyncNewDevice from '../screens/SyncNewDevice';
import { ContactDetail } from '../screens/ContactDetail/ContactDetail';
import { NewContact } from '../screens/NewContact/NewContact';
import Security from '../screens/Security/Security';
import { ContactScreen } from '../screens/Contacts/Contacts';
import PlanAndUsage from '../screens/PlanAndUsage/PlanAndUsage';
import backArrow from './utils/backArrow';
import { colors } from '../util/colors';

export const ProfileStack = createNativeStackNavigator<ProfileStackParams>();
export const ProfileRoot = () => (
  <ProfileStack.Navigator initialRouteName={'profileMain'}>
    <ProfileStack.Screen
      name="profileMain"
      component={ProfileScreen}
      options={{
        title: '',
        headerTransparent: true,
      }}
    />
    <ProfileStack.Screen
      name={'contacts'}
      component={ContactScreen}
      options={({ navigation }) => ({
        title: '',
        ...backArrow({ navigation, color: colors.primaryDark }),
        headerTransparent: true,
      })}
    />
    <ProfileStack.Screen
      name={'contactDetail'}
      component={ContactDetail}
      options={{
        headerShown: false,
      }}
    />
    <ProfileStack.Screen
      name={'newContact'}
      component={NewContact}
      options={{
        headerShown: false,
      }}
    />
    <ProfileStack.Screen
      name={'planAndUsage'}
      component={PlanAndUsage}
      options={({ navigation }) => ({
        title: 'Plan & Usage',
        ...backArrow({ navigation, color: colors.primaryDark }),
      })}
    />
    <ProfileStack.Screen
      name={'security'}
      component={Security}
      options={({ navigation }) => ({
        title: 'Security',
        ...backArrow({ navigation, color: colors.primaryDark }),
      })}
    />
    <ProfileStack.Screen
      name={'syncNewDevice'}
      component={SyncNewDevice}
      options={({ navigation }) => ({
        title: 'Sync New Device',
        ...backArrow({ navigation, color: colors.primaryDark }),
      })}
    />
  </ProfileStack.Navigator>
);
