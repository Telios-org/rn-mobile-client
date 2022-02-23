import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { IntroScreen } from './screens/IntroScreen';
import { RegisterScreen } from './screens/RegisterScreen';
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

export type RootStackParams = {
  test: undefined;
  intro: undefined;
  register: undefined;
  login: undefined;
  main: undefined;
  compose: undefined;
  search: undefined;
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
  newAliasNamespace: undefined;
  newAlias: undefined;
};

export type MainStackParams = {
  inbox: undefined;
  drafts: undefined;
  sent: undefined;
  trash: undefined;
  profile: undefined;
  aliasManage: undefined;
  aliasMailbox: undefined;
};

const Stack = createNativeStackNavigator<RootStackParams>();
const Drawer = createDrawerNavigator<MainStackParams>();

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
        component={InboxScreen}
        options={({ navigation, route }) => ({
          headerTintColor: colors.inkDarker,
          title: '',
          headerRight: props => (
            <NavIconButton
              icon={{ name: 'search-outline' }}
              onPress={() => navigation.navigate('search')}
            />
          ),
        })}
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

export const Navigator = () => {
  const localUsernames = useAppSelector(state => state.main.localUsernames);
  const hasLocalAccount = localUsernames.length > 0;
  const isAuthenticated = useIsAuthenticated();
  return (
    <NavigationContainer>
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
                name="registerSuccess"
                component={RegisterSuccessScreen}
                options={{
                  headerTransparent: true,
                  title: '',
                }}
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
              name={'register'}
              component={RegisterScreen}
              options={{ title: 'Register' }}
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

            {/* register screens */}
            <Stack.Group
              screenOptions={{
                headerBackTitleVisible: false,
                headerTransparent: true,
                title: '',
                headerTintColor: colors.primaryDark,
              }}>
              <Stack.Screen
                name="registerBetaCode"
                component={RegisterBetaCodeScreen}
              />
              <Stack.Screen
                name="registerConsent"
                component={RegisterConsentScreen}
              />
              <Stack.Screen
                name="registerUsername"
                component={RegisterUsernameScreen}
              />
              <Stack.Screen
                name="registerPassword"
                component={RegisterPasswordScreen}
              />
              <Stack.Screen
                name="registerRecoveryEmail"
                component={RegisterRecoveryEmailScreen}
              />
            </Stack.Group>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
