import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { NotificationsScreen } from '../screens/Profile/NotificationsScreen';
import { StatisticsScreen } from '../screens/Profile/StatisticsScreen';
import React from 'react';
import { ProfileStackParams } from './Navigator';
import SyncNewDevice from '../screens/SyncNewDevice';
import { ContactDetail } from '../screens/ContactDetail/ContactDetail';
import { NewContact } from '../screens/NewContact/NewContact';
import Security from '../screens/Security/Security';
import { ContactScreen } from '../screens/Contacts/Contacts';
import PlanAndUsage from '../screens/PlanAndUsage/PlanAndUsage';

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
      options={{
        title: '',
        headerTransparent: true,
      }}
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
      name={'notifications'}
      component={NotificationsScreen}
      options={{ title: 'NotificationsScreen' }}
    />
    <ProfileStack.Screen
      name={'statistics'}
      component={StatisticsScreen}
      options={{ title: 'StatisticsScreen' }}
    />
    <ProfileStack.Screen
      name={'planAndUsage'}
      component={PlanAndUsage}
      options={{ title: 'Plan & Usage' }}
    />
    <ProfileStack.Screen
      name={'security'}
      component={Security}
      options={{ title: 'Security' }}
    />
    <ProfileStack.Screen
      name={'syncNewDevice'}
      component={SyncNewDevice}
      options={{ title: 'Sync New Device' }}
    />
  </ProfileStack.Navigator>
);
