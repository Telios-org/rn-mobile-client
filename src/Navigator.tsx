import React from 'react';
import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { IntroScreen } from './screens/IntroScreen';
import { LoginScreen } from './screens/LoginScreen';
import { InboxScreen } from './screens/InboxScreen';
import { useAppSelector, useIsAuthenticated } from './hooks';
import { DrawerContent } from './components/DrawerContent';
import { ComposeScreen } from './screens/ComposeScreen';
import { TestScreen } from './screens/TestScreen';
import { RegisterBetaCodeScreen } from './screens/RegisterBetaCodeScreen';
import { colors } from './util/colors';
import { RegisterConsentScreen } from './screens/RegisterConsentScreen';
import { RegisterUsernameScreen } from './screens/RegisterUsernameScreen';
import { RegisterPasswordScreen } from './screens/RegisterPasswordScreen';
import { RegisterRecoveryEmailScreen } from './screens/RegisterRecoveryEmailScreen';
import { RegisterSuccessScreen } from './screens/RegisterSuccessScreen';
import { Icon } from './components/Icon';
import { TouchableOpacity } from 'react-native';
import { SearchScreen } from './screens/SearchScreen';
import { NavIconButton } from './components/NavIconButton';
import { DraftsScreen } from './screens/DraftsScreen';
import { SentScreen } from './screens/SentScreen';
import { TrashScreen } from './screens/TrashScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AliasManageScreen } from './screens/AliasManageScreen';
import { NewAliasNamespaceScreen } from './screens/NewAliasNamespaceScreen';
import { NewAliasScreen } from './screens/NewAliasScreen';
import { EmailDetailScreen } from './screens/EmailDetailScreen';

export type CoreStackProps = {
  register: undefined;
  core: undefined;
};

export type RootStackParams = {
  test: undefined;
  intro: undefined;
  login: undefined;
  main: undefined;
  register: undefined;

  compose: undefined;
  search: undefined;
  newAliasNamespace: undefined;
  newAlias: undefined;
};

export type RegisterStackParams = {
  registerBetaCode: undefined;
  registerConsent: { code: string };
  registerUsername: { code: string; accepted: boolean };
  registerPassword: { code: string; accepted: boolean; email: string };
  registerRecoveryEmail: {
    code: string;
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
  profile: undefined;
  aliasManage: undefined;
  aliasMailbox: undefined;
};

export type InboxStackParams = {
  inboxMain: undefined;
  emailDetail: { emailId: string };
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
    <InboxStack.Screen
      name="emailDetail"
      component={EmailDetailScreen}
      options={{ title: '' }}
    />
  </InboxStack.Navigator>
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
              options={({ navigation }) => ({
                title: 'Search',
                headerLeft: () => (
                  <NavIconButton
                    icon={{ name: 'close-outline', size: 28 }}
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
        options={{ title: 'Drafts' }}
      />
      <Drawer.Screen
        name={'sent'}
        component={SentScreen}
        options={{ title: 'Sent' }}
      />
      <Drawer.Screen
        name={'trash'}
        component={TrashScreen}
        options={{ title: 'Trash' }}
      />
      <Drawer.Screen
        name={'profile'}
        component={ProfileScreen}
        options={{
          headerTransparent: true,
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
      initialRouteName="registerBetaCode"
      screenOptions={{
        headerBackTitleVisible: false,
        headerTransparent: true,
        title: '',
        headerTintColor: colors.primaryDark,
      }}>
      <RegisterStack.Screen
        name="registerBetaCode"
        component={RegisterBetaCodeScreen}
        options={({ navigation, route }) => ({
          title: '',
          headerTintColor: colors.inkDarker,
          headerBackVisible: true,
          headerLeft: props => (
            <NavIconButton
              icon={{ name: 'chevron-back', color: colors.primaryDark }}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />
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
  return (
    <NavigationContainer>
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
