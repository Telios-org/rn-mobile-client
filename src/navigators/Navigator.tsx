import React from 'react';
import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import RNBootSplash from 'react-native-bootsplash';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { IntroScreen } from '../screens/IntroScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { InboxScreen } from '../screens/Inbox/InboxScreen';
import { useAppSelector, useUserSelector } from '../hooks';
import { DrawerContent } from '../components/DraweContent/DrawerContent';
import { ComposeScreen } from '../screens/Compose/ComposeScreen';
import { TestScreen } from '../screens/TestScreen';
import { colors } from '../util/colors';
import { RegisterConsentScreen } from '../screens/RegisterConsent/RegisterConsentScreen';
import { RegisterUsernameScreen } from '../screens/RegisterUsername/RegisterUsernameScreen';
import { RegisterPasswordScreen } from '../screens/RegisterPasswordScreen';
import { RegisterRecoveryEmailScreen } from '../screens/RegisterRecoveryEmailScreen';
import { RegisterSuccessScreen } from '../screens/RegisterSuccessScreen';
import { SearchScreen } from '../screens/Search/SearchScreen';
import { SearchSectionScreen } from '../screens/SearchSection/SearchSectionScreen';
import { NavIconButton } from '../components/NavIconButton';
import { DraftsScreen } from '../screens/Drafts/DraftsScreen';
import { SentScreen } from '../screens/Sent/SentScreen';
import { TrashScreen } from '../screens/TrashScreen';
import { AliasManageScreen } from '../screens/AliasManage/AliasManageScreen';
import { NewAliasNamespaceScreen } from '../screens/NewAliasNamespace/NewAliasNamespaceScreen';
import { NewAliasScreen } from '../screens/NewAlias/NewAliasScreen';
import { EmailDetailScreen } from '../screens/EmailDetails/EmailDetailScreen';
import { AliasInboxScreen } from '../screens/AliasInbox';
import { AliasInfoScreen } from '../screens/AliasInfo';
import NewAliasRandom from '../screens/NewAliasRandom';
import ForgotPassword, { ForgotPasswordStackParams } from './ForgotPassword';
import { ProfileRoot } from './Profile';
import Sync, { SyncStackParams } from './Sync';
import backArrow from './utils/backArrow';
import { selectIsSignedIn } from '../store/selectors/account';
import { Attachment } from '../store/types';
import { spacing } from '../util/spacing';

export type CoreStackProps = {
  core: NavigatorScreenParams<RootStackParams> | undefined;
};

export type RootStackParams = {
  test: undefined;
  intro: undefined;
  login: undefined;
  register: NavigatorScreenParams<RegisterStackParams> | undefined;
  main: NavigatorScreenParams<MainStackParams> | undefined;
  compose:
    | {
        to?: string[];
        from?: string;
        subject?: string;
        bodyAsText?: string;
        bodyAsHTML?: string;
        cc?: string[];
        bcc?: string[];
        attachments?: Attachment[];
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
  forgotPassword: NavigatorScreenParams<ForgotPasswordStackParams> | undefined;
  sync: NavigatorScreenParams<SyncStackParams> | undefined;
  emailDetail: {
    emailId: string;
    folderId: number;
    isUnread: boolean;
  };
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

function CoreScreen() {
  const localUsernames = useAppSelector(state => state.account.localUsernames);
  const hasLocalAccount = localUsernames.length > 0;
  const hasUser = useUserSelector();
  const isSignedIn = useSelector(selectIsSignedIn);

  return (
    <Stack.Navigator initialRouteName={hasLocalAccount ? 'login' : 'intro'}>
      {hasUser && isSignedIn ? (
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
              options={({ navigation }) => ({
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
          <Stack.Screen
            name="forgotPassword"
            component={ForgotPassword}
            options={navigation => ({
              ...backArrow(navigation),
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="sync"
            component={Sync}
            options={navigation => ({
              ...backArrow(navigation),
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="register"
            component={Register}
            options={{
              presentation: 'containedModal',
              headerShown: false,
            }}
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
        options={({ navigation }) => ({
          title: '',
          headerTintColor: colors.inkDarker,
          headerRight: () => (
            <NavIconButton
              icon={{ name: 'search-outline' }}
              onPress={() => navigation.navigate('search')}
              style={{ alignSelf: 'flex-end', paddingRight: spacing.lg }}
            />
          ),
        })}
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
    </RegisterStack.Navigator>
  );
}

export const Navigator = () => {
  console.log('Navigator');
  return (
    <NavigationContainer
      onReady={() => {
        if (Platform.OS === 'android') {
          RNBootSplash.hide({ fade: true });
        }
      }}
      onStateChange={(state) =>
        console.log('navigator state change', state)
        // AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }>
      <CoreStack.Navigator initialRouteName="core">
        <CoreStack.Screen
          name="core"
          component={CoreScreen}
          options={{ headerShown: false }}
        />
      </CoreStack.Navigator>
    </NavigationContainer>
  );
};
