import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useHeaderHeight } from '@react-navigation/elements';
import React, { useCallback, useRef, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { RegisterStackParams } from '../../Navigator';
import { fonts } from '../../util/fonts';
import { spacing } from '../../util/spacing';
import { colors } from '../../util/colors';
import { Result } from '../../util/types';
// @ts-ignore
import envApi from '../../../env_api.json';
import { debounce } from 'lodash';
import { validateTeliosEmail } from '../../util/regexHelpers';
import NextButton from '../../components/NextButton';
import styles from './styles';

export type RegisterUsernameScreenProps = NativeStackScreenProps<
  RegisterStackParams,
  'registerUsername'
>;

export const RegisterUsernameScreen = (props: RegisterUsernameScreenProps) => {
  const { accepted } = props.route.params;
  const headerHeight = useHeaderHeight();
  const modalizeRef = useRef<Modalize>(null);

  const emailPostfix = envApi.postfix;

  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  const getEmail = (username: string) => `${username}@${emailPostfix}`;

  const onVerify = async (value: string) => {
    const email = getEmail(value);
    const response = await getEmailAvailability(email);
    const isAvailableResp =
      response.type === 'success' && response.value.isAvailable;
    setIsAvailable(isAvailableResp);
    setLoadingVerify(false);
    if (!isAvailableResp) {
      setError('Not available');
    } else {
      setError(undefined);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceVerify = useCallback(
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
  // TODO: add scrollView wrapper and children
  return (
    <>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollViewContentContainer,
          { marginTop: headerHeight },
        ]}>
        <View style={styles.content}>
          <Text style={fonts.title2}>Create Account</Text>
          <Text style={[fonts.regular.regular, { marginTop: spacing.sm }]}>
            Choose your email. This can be anything! But it must be unique.
          </Text>
          <Input
            textInputStyle={styles.textInputStyle}
            onChangeText={onChange}
            value={username}
            error={error}
            label="Email"
            placeholder="johndoe"
            autoFocus={true}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            keyboardType="email-address"
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
              <View style={styles.postfixContainer}>
                <Text style={fonts.regular.bold}>{`@${emailPostfix}`}</Text>
              </View>
            )}
          />

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
                modalizeRef.current?.open();
              }}
            />
          </View>
        </View>
      </ScrollView>
      <NextButton
        disabled={!isAvailable}
        onSubmit={onSubmit}
        style={styles.nextBtn}
        useKeyboardAvoidingView={false}
      />
      <Modalize ref={modalizeRef} adjustToContentHeight={true}>
        <View style={styles.modalContent}>
          <Text style={fonts.title3}>{'Allowable Characters'}</Text>
          <Text style={[fonts.regular.regular, { marginTop: spacing.md }]}>
            {'No special characters are allowed except for .'}
          </Text>
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
    const response = await fetch(`${envApi.dev}/mailbox/addresses/${email}`, {
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
      error: new Error('An error occurred. Please try again later.'),
    };
  }
};
