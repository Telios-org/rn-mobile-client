import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useHeaderHeight } from '@react-navigation/elements';

import React from 'react';
import { View, Text, ScrollView, InputAccessoryView } from 'react-native';
import { Modalize } from 'react-native-modalize';

import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { RegisterStackParams, RootStackParams } from '../Navigator';
import { fonts } from '../util/fonts';
import { spacing } from '../util/spacing';
import { colors } from '../util/colors';
import { Result } from '../util/types';
import envApi from '../../env_api.json';
import { debounce } from 'lodash';
import { validateTeliosEmail } from '../util/regexHelpers';

export type RegisterUsernameScreenProps = NativeStackScreenProps<
  RegisterStackParams,
  'registerUsername'
>;

const accessoryId = 'input-username-accessory';

export const RegisterUsernameScreen = (props: RegisterUsernameScreenProps) => {
  const { accepted } = props.route.params;
  const headerHeight = useHeaderHeight();
  const modalizeRef = React.useRef<Modalize>(null);

  // TODO: dev vs prod switch
  const emailPostfix = envApi.prodMail;

  const [username, setUsername] = React.useState('');
  const [error, setError] = React.useState<string | undefined>();
  const [loadingVerify, setLoadingVerify] = React.useState(false);
  const [isAvailable, setIsAvailable] = React.useState(false);

  const getEmail = (username: string) => `${username}@${emailPostfix}`;

  const onVerify = async (value: string) => {
    const email = getEmail(value);
    const response = await getEmailAvailability(email);
    const isAvailable =
      response.type === 'success' && response.value.isAvailable;
    setIsAvailable(isAvailable);
    setLoadingVerify(false);
    if (!isAvailable) {
      setError('Not available');
    } else {
      setError(undefined);
    }
  };

  const debounceVerify = React.useCallback(
    debounce(onVerify, 500, { trailing: true }),
    [],
  );

  const onChange = (value: string) => {
    setUsername(value);
    if (validateTeliosEmail(getEmail(value))) {
      console.log('valid, will callout ', getEmail(value));
      setError(undefined);
      setIsAvailable(false);
      setLoadingVerify(true);
      debounceVerify(value);
    } else {
      console.log('validateTeliosEmail fail', getEmail(value));
      setError('Invalid email');
      setIsAvailable(false);
    }
  };

  const onSubmit = () => {
    if (!isAvailable) {
      return;
    }
    props.navigation.navigate('registerPassword', {
      accepted,
      email: getEmail(username),
    });
  };

  const NextButton = () => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}>
      <Button
        size="large"
        title="Next"
        disabled={!isAvailable}
        onPress={onSubmit}
      />
    </View>
  );

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}
        contentContainerStyle={{ marginTop: headerHeight, flexGrow: 1 }}>
        <View style={{ margin: spacing.lg, flex: 1 }}>
          <Text style={fonts.title2}>{'Create Account'}</Text>
          <Text style={[fonts.regular.regular, { marginTop: spacing.sm }]}>
            {'Choose your email. This can be anything! But it must be unique.'}
          </Text>
          <View style={{ flexDirection: 'row', marginTop: spacing.lg }}>
            <Input
              style={{ flex: 1 }}
              textInputStyle={{ paddingRight: 100 }}
              onChangeText={onChange}
              value={username}
              error={error}
              label="Email"
              placeholder="johndoe"
              autoFocus={true}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              inputAccessoryViewID={accessoryId}
              loading={loadingVerify}
              loadingPosition="left"
              iconLeft={{
                name: 'mail-outline',
                color: isAvailable
                  ? colors.success
                  : error
                  ? colors.error
                  : colors.skyBase,
              }}
              onSubmitEditing={onSubmit}
              returnKeyType="done"
              renderCustomRightView={() => (
                <View style={{ height: '100%', justifyContent: 'center' }}>
                  <Text style={fonts.regular.bold}>{`@${emailPostfix}`}</Text>
                </View>
              )}
            />
            <View
              style={{
                marginLeft: spacing.sm,
                justifyContent: 'flex-end',
              }}></View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <Button
              size="small"
              type="text"
              title="whats allowed?"
              style={{ marginTop: spacing.sm }}
              onPress={() => {
                // todo show modal
                modalizeRef.current?.open();
              }}
            />
          </View>
          <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
            <NextButton />
          </View>
        </View>
      </ScrollView>
      <InputAccessoryView nativeID={accessoryId}>
        <View
          style={{
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
          }}>
          <NextButton />
        </View>
      </InputAccessoryView>
      <Modalize ref={modalizeRef} adjustToContentHeight={true}>
        <View
          style={{
            marginHorizontal: spacing.lg,
            marginTop: spacing.xl,
            marginBottom: spacing.lg,
          }}>
          <Text style={fonts.title3}>{'Allowable Characters'}</Text>
          <Text
            style={[
              fonts.regular.regular,
              { marginTop: spacing.md },
            ]}>{`No special characters are allowed except for .`}</Text>
          <Button
            title="Done"
            style={{ marginTop: spacing.lg }}
            onPress={() => modalizeRef.current?.close()}
          />
        </View>
      </Modalize>
    </>
  );
};

const getEmailAvailability = async (
  email: string,
): Promise<Result<{ isAvailable: boolean }>> => {
  try {
    console.log('verifying email');
    const response = await fetch(`${envApi.prod}/mailbox/addresses/${email}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      const body = await response.json();
      const isAvailable = Object.keys(body).length === 0;
      console.log('response body', body, isAvailable);
      return { type: 'success', value: { isAvailable } };
    } else {
      return {
        type: 'error',
        error: new Error(`An unknown error occured ${response.status}`),
      };
    }
  } catch (error) {
    console.log(error);
    return {
      type: 'error',
      error: new Error(`An error occurred. Please try again later.`),
    };
  }
};
