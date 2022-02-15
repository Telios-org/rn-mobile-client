import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useHeaderHeight } from '@react-navigation/elements';

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  InputAccessoryView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { RootStackParams } from '../Navigator';
import { fonts } from '../util/fonts';
import { spacing } from '../util/spacing';
import { colors } from '../util/colors';
import { Result } from '../util/types';
import envApi from '../../env_api.json';
import { debounce } from 'lodash';
import { Icon } from '../components/Icon';

export type RegisterScreenProps = NativeStackScreenProps<
  RootStackParams,
  'registerBetaCode'
>;

const debounceFunc = (value: string) => {
  console.log('debounced func', value);
};

export const RegisterBetaCodeScreen = () => {
  const headerHeight = useHeaderHeight();
  const [code, setCode] = React.useState('');
  const [loadingVerify, setLoadingVerify] = React.useState(false);
  const [verifyResponse, setVerifyResponse] = React.useState<
    Result<any> | undefined
  >();

  const onVerify = async (value: string) => {
    setLoadingVerify(true);
    const response = await validateBetaCode(value);
    setVerifyResponse(response);
    setLoadingVerify(false);
  };

  const debounceVerify = React.useCallback(
    debounce(onVerify, 500, { trailing: true }),
    [],
  );

  const onChange = (value: string) => {
    setCode(value);
    if (value) {
      debounceVerify(value);
    }
  };

  const onSubmit = () => {};

  const isValid = verifyResponse?.type === 'success';

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}
      contentContainerStyle={{ marginTop: headerHeight }}>
      <View style={{ margin: spacing.lg, flex: 1 }}>
        <Text style={fonts.title2}>{'Enter Beta Code'}</Text>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL('https://www.telios.io');
          }}>
          <Text style={[fonts.regular.regular, { marginTop: spacing.sm }]}>
            {'Telios is still in Beta. If you do not have a beta code,'}
            <Text style={{ color: colors.primaryBase }}>
              {' join our waitlist.'}
            </Text>
          </Text>
        </TouchableOpacity>
        <Input
          style={{ marginTop: spacing.lg }}
          onChangeText={onChange}
          value={code}
          error={null}
          label="Beta Code"
          placeholder="000000"
          autoFocus={true}
          autoCapitalize="none"
          autoCorrect={false}
          loading={loadingVerify}
          iconRight={
            verifyResponse?.type === 'success'
              ? { name: 'checkmark-circle-outline', color: 'green' }
              : verifyResponse?.type === 'error'
              ? { name: 'close-circle-outline', color: 'red' }
              : null
          }
        />
        <KeyboardAvoidingView
          style={{ marginTop: spacing.xxl }}
          behavior={'padding'}
          keyboardVerticalOffset={80}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginVertical: spacing.md,
            }}>
            <Button
              size="large"
              title="Next"
              disabled={!isValid}
              onPress={onSubmit}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  );
};

const validateBetaCode = async (
  betaCode: string,
): Promise<Result<{ status: number }>> => {
  try {
    console.log('verifying beta code');
    const response = await fetch(`${envApi.dev}/account/beta/verify`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vcode: betaCode,
      }),
    });
    if (response.status === 200) {
      return { type: 'success', value: { status: response.status } };
    } else if (response.status === 400) {
      return { type: 'error', error: new Error('Invalid Code') };
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
