import React from 'react';
import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { IntroScreen } from './screens/IntroScreen';
import { LoginScreen } from './screens/LoginScreen';
import { InboxScreen } from './screens/Inbox/InboxScreen';
import { useAppSelector, useIsAuthenticated } from './hooks';
import { DrawerContent } from './components/DraweContent/DrawerContent';
import { ComposeScreen } from './screens/ComposeScreen';
import { TestScreen } from './screens/TestScreen';
import { colors } from './util/colors';
import { RegisterConsentScreen } from './screens/RegisterConsent/RegisterConsentScreen';
import { RegisterUsernameScreen } from './screens/RegisterUsername/RegisterUsernameScreen';
import { RegisterPasswordScreen } from './screens/RegisterPasswordScreen';
import { RegisterRecoveryEmailScreen } from './screens/RegisterRecoveryEmailScreen';
import { RegisterSuccessScreen } from './screens/RegisterSuccessScreen';
import { SearchScreen } from './screens/Search/SearchScreen';
import { SearchSectionScreen } from './screens/SearchSection/SearchSectionScreen';
import { NavIconButton } from './components/NavIconButton';
import { DraftsScreen } from './screens/DraftsScreen';
import { SentScreen } from './screens/SentScreen';
import { TrashScreen } from './screens/TrashScreen';
import { ProfileScreen } from './screens/Profile/ProfileScreen';
import { ContactScreen } from './screens/Contacts/Contacts';
import { ContactDetail } from './screens/ContactDetail/ContactDetail';
import { NotificationsScreen } from './screens/Profile/NotificationsScreen';
import { StatisticsScreen } from './screens/Profile/StatisticsScreen';
import { SyncNewDeviceScreen } from './screens/Profile/SyncNewDeviceScreen';
import { AliasManageScreen } from './screens/AliasManage/AliasManageScreen';
import { NewAliasNamespaceScreen } from './screens/NewAliasNamespace/NewAliasNamespaceScreen';
import { NewAliasScreen } from './screens/NewAlias/NewAliasScreen';
import { EmailDetailScreen } from './screens/EmailDetails/EmailDetailScreen';
import RNBootSplash from 'react-native-bootsplash';
import { Platform } from 'react-native';
import ForgotPassword from './screens/ForgotPassword';
import RecoverAccount from './screens/RecoverAccount';
import RecoverAccountCode from './screens/RecoverAccountCode';
import EnterNewPassword from './screens/EnterNewPassword';
import { AliasInboxScreen } from './screens/AliasInbox';
import { AliasInfoScreen } from './screens/AliasInfo';
import NewAliasRandom from './screens/NewAliasRandom';
import { NewContact } from './screens/NewContact/NewContact';
import Security from './screens/Security/Security';
import PlanAndUsage from './screens/PlanAndUsage/PlanAndUsage';

export type CoreStackProps = {
  register: undefined;
  core: undefined;
};

export type RootStackParams = {
  test: undefined;
  intro: undefined;
  login: undefined;
  main: undefined;
  register: NavigatorScreenParams<RegisterStackParams> | undefined;
  compose:
    | {
        to?: string[];
        from?: string;
        subject?: string;
        body?: string;
        cc?: string[];
        bcc?: string[];
      }
    | undefined;
  search: undefined;
  searchSection: {
    folderId: string;
    aliasId?: string;
    title?: string;
    searchKey?: string;
  };
  newAliasNamespace: undefined;
  newAlias: { namespace: string };
  newAliasRandom: undefined;
  aliasInfo: { aliasId: string; aliasName: string };
  emailDetail: { emailId: string; isUnread: boolean; isTrash?: boolean };
};

export type RegisterStackParams = {
  registerConsent: undefined;
  registerUsername: { accepted: boolean };
  registerPassword: { accepted: boolean; email: string };
  registerRecoveryEmail: {
    accepted: boolean;
    email: string;
    password: string;
  };
  registerSuccess: undefined;
  forgotPassword: undefined;
  enterNewPassword: { passphrase?: string; hasValidCode?: boolean };
  recoverAccount: undefined;
  recoverAccountCode: { recoveryEmail: string };
};

export type MainStackParams = {
  inbox: NavigatorScreenParams<InboxStackParams>;
  drafts: undefined;
  sent: undefined;
  trash: undefined;
  profile: NavigatorScreenParams<ProfileStackParams>;
  aliasManage: undefined;
  aliasInbox: { aliasId: string; namespaceKey: string }; // namespaceKey is required for drawer navigator
};

export type ProfileStackParams = {
  profileMain: undefined;
  contacts: undefined;
  contactDetail: { contactId: string; editContent?: boolean };
  newContact: undefined;
  notifications: undefined;
  statistics: undefined;
  syncNewDevice: undefined;
  security: undefined;
  planAndUsage: undefined;
};

export type InboxStackParams = {
  inboxMain: undefined;
};

const CoreStack = createNativeStackNavigator<CoreStackProps>();
const Stack = createNativeStackNavigator<RootStackParams>();
const RegisterStack = createNativeStackNavigator<RegisterStackParams>();
const Drawer = createDrawerNavigator<MainStackParams>();

const showBackArrow = ({ navigation }: any) => ({
  headerLeft: () => (
    <NavIconButton
      icon={{ name: 'chevron-back', size: 28 }}
      onPress={() => navigation.goBack()}
    />
  ),
});

const InboxStack = createNativeStackNavigator<InboxStackParams>();
const InboxRoot = () => (
  <InboxStack.Navigator initialRouteName={'inboxMain'}>
    <InboxStack.Screen
      name="inboxMain"
      component={InboxScreen}
      options={({ navigation, route }) => ({
        title: '',
        headerTintColor: colors.inkDarker,
        headerLeft: props => (
          <NavIconButton
            icon={{ name: 'menu-outline' }}
            onPress={() => navigation.openDrawer()}
          />
        ),
        headerRight: props => (
          <NavIconButton
            icon={{ name: 'search-outline' }}
            onPress={() => navigation.navigate('search')}
          />
        ),
      })}
    />
  </InboxStack.Navigator>
);

const ProfileStack = createNativeStackNavigator<ProfileStackParams>();
const ProfileRoot = () => (
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
      name={'security'}
      component={Security}
      options={{ title: 'Security' }}
    />
    <ProfileStack.Screen
      name={'planAndUsage'}
      component={PlanAndUsage}
      options={{ title: 'Plan & Usage' }}
    />
    <ProfileStack.Screen
      name={'syncNewDevice'}
      component={SyncNewDeviceScreen}
      options={{ title: 'SyncNewDeviceScreen' }}
    />
  </ProfileStack.Navigator>
);

function CoreScreen() {
  const localUsernames = useAppSelector(state => state.account.localUsernames);
  const hasLocalAccount = localUsernames.length > 0;
  const isAuthenticated = useIsAuthenticated();

  return (
    <Stack.Navigator initialRouteName={hasLocalAccount ? 'login' : 'intro'}>
      {isAuthenticated ? (
        <>
          <Stack.Group>
            <Stack.Screen
              name="main"
              component={Main}
              options={{ headerShown: false }}
            />
          </Stack.Group>
          <Stack.Group
            screenOptions={{
              presentation: 'containedModal',
              headerTintColor: colors.inkDarkest,
              headerBackTitleVisible: false,
            }}>
            <Stack.Screen
              name="compose"
              component={ComposeScreen}
              options={{ title: 'Compose' }}
            />
            <Stack.Screen
              name="search"
              component={SearchScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="searchSection"
              component={SearchSectionScreen}
              options={({ navigation }) => ({
                headerTintColor: colors.inkDarker,
                headerLeft: () => (
                  <NavIconButton
                    icon={{ name: 'chevron-back' }}
                    onPress={() => navigation.goBack()}
                  />
                ),
              })}
            />

            <Stack.Screen
              name="newAliasNamespace"
              component={NewAliasNamespaceScreen}
              options={({ navigation }) => ({
                title: 'Create Namespace',
                headerLeft: () => (
                  <NavIconButton
                    icon={{ name: 'close-outline', size: 28 }}
                    onPress={() => navigation.goBack()}
                  />
                ),
              })}
            />
            <Stack.Screen
              name="newAlias"
              component={NewAliasScreen}
              options={({ navigation }) => ({
                title: 'Create New Alias',
                headerLeft: () => (
                  <NavIconButton
                    icon={{ name: 'close-outline', size: 28 }}
                    onPress={() => navigation.goBack()}
                  />
                ),
              })}
            />
            <Stack.Screen
              name="newAliasRandom"
              component={NewAliasRandom}
              options={({ navigation }) => ({
                title: 'Generate Random Alias',
                headerLeft: () => (
                  <NavIconButton
                    icon={{ name: 'close-outline', size: 28 }}
                    onPress={() => navigation.goBack()}
                  />
                ),
              })}
            />
            <Stack.Screen
              name="aliasInfo"
              component={AliasInfoScreen}
              options={({ navigation, route }) => ({
                title: `@ ${route.params.aliasName}`,
                headerLeft: () => (
                  <NavIconButton
                    icon={{ name: 'chevron-back', size: 28 }}
                    onPress={() => navigation.goBack()}
                  />
                ),
              })}
            />
            <Stack.Screen
              name="emailDetail"
              component={EmailDetailScreen}
              options={({ navigation, route }) => ({
                title: '',
                headerLeft: () => (
                  <NavIconButton
                    icon={{ name: 'chevron-back', size: 28 }}
                    onPress={() => navigation.goBack()}
                  />
                ),
              })}
            />
          </Stack.Group>
        </>
      ) : (
        <>
          <Stack.Screen
            name={'intro'}
            component={IntroScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={'login'}
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="test"
            component={TestScreen}
            options={{ title: 'Test' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

function Main() {
  return (
    <Drawer.Navigator
      initialRouteName="inbox"
      screenOptions={{
        drawerStyle: {
          width: '80%',
        },
        headerTintColor: colors.inkDarker,
      }}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name={'inbox'}
        component={InboxRoot}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name={'drafts'}
        component={DraftsScreen}
        options={{ title: '' }}
      />
      <Drawer.Screen
        name={'sent'}
        component={SentScreen}
        options={{ title: '' }}
      />
      <Drawer.Screen
        name={'trash'}
        component={TrashScreen}
        options={{ title: '' }}
      />
      <Drawer.Screen
        name={'profile'}
        component={ProfileRoot}
        options={{
          headerTransparent: true,
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name={'aliasInbox'}
        component={AliasInboxScreen}
        options={{
          title: '',
        }}
      />
      <Drawer.Screen
        name={'aliasManage'}
        component={AliasManageScreen}
        options={{
          title: 'Manage Aliases',
        }}
      />
    </Drawer.Navigator>
  );
}

function Register() {
  return (
    <RegisterStack.Navigator
      initialRouteName="registerConsent"
      screenOptions={{
        headerBackTitleVisible: false,
        headerTransparent: true,
        title: '',
        headerTintColor: colors.primaryDark,
      }}>
      <RegisterStack.Screen
        name="registerConsent"
        component={RegisterConsentScreen}
      />
      <RegisterStack.Screen
        name="registerUsername"
        component={RegisterUsernameScreen}
      />
      <RegisterStack.Screen
        name="registerPassword"
        component={RegisterPasswordScreen}
      />
      <RegisterStack.Screen
        name="registerRecoveryEmail"
        component={RegisterRecoveryEmailScreen}
      />
      <RegisterStack.Screen
        name="registerSuccess"
        component={RegisterSuccessScreen}
        options={{
          headerBackVisible: false,
          gestureEnabled: false,
        }}
      />
      <RegisterStack.Screen
        name="forgotPassword"
        component={ForgotPassword}
        options={showBackArrow}
      />
      <RegisterStack.Screen
        name="enterNewPassword"
        component={EnterNewPassword}
        options={showBackArrow}
      />
      <RegisterStack.Screen
        name="recoverAccount"
        component={RecoverAccount}
        options={showBackArrow}
      />
      <RegisterStack.Screen
        name="recoverAccountCode"
        component={RecoverAccountCode}
        options={showBackArrow}
      />
    </RegisterStack.Navigator>
  );
}

export const Navigator = () => {
  return (
    <NavigationContainer
      onReady={() => {
        if (Platform.OS === 'android') {
          RNBootSplash.hide({ fade: true });
        }
      }}>
      <CoreStack.Navigator initialRouteName="core">
        <CoreStack.Screen
          name="register"
          component={Register}
          options={{
            presentation: 'containedModal',
            headerShown: false,
          }}
        />
        <CoreStack.Screen
          name="core"
          component={CoreScreen}
          options={{ headerShown: false }}
        />
      </CoreStack.Navigator>
    </NavigationContainer>
  );
};
