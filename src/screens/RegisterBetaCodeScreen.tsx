import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useHeaderHeight } from '@react-navigation/elements';

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  InputAccessoryView,
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

export type RegisterBetaCodeScreenProps = NativeStackScreenProps<
  RootStackParams,
  'registerBetaCode'
>;

const accessoryId = 'input-betacode-accessory';

export const RegisterBetaCodeScreen = (props: RegisterBetaCodeScreenProps) => {
  const headerHeight = useHeaderHeight();
  const [code, setCode] = React.useState('');
  const [loadingVerify, setLoadingVerify] = React.useState(false);
  const [verifyResponse, setVerifyResponse] = React.useState<
    Result<any> | undefined
  >();

  const onVerify = async (value: string) => {
    const response = await validateBetaCode(value);
    setVerifyResponse(response);

    // TODO: this gets called sometimes when another debounce is in progress
    // which makes the loading indicator stop too soon.
    // may need to implement loading state based on each individual value
    setLoadingVerify(false);
  };

  const debounceVerify = React.useCallback(
    debounce(onVerify, 500, { trailing: true }),
    [],
  );

  const onChange = (value: string) => {
    setCode(value);
    if (value) {
      setLoadingVerify(true);
      debounceVerify(value);
    }
  };

  const isValid = verifyResponse?.type === 'success';

  const onSubmit = () => {
    if (!isValid) {
      return;
    }
    props.navigation.navigate('registerConsent', { code: code });
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
        disabled={!isValid}
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
          <Text style={fonts.title2}>{'Enter Beta Code'}</Text>

          <Text style={[fonts.regular.regular, { marginTop: spacing.sm }]}>
            {'Telios is still in Beta. If you do not have a beta code, '}
            <Text
              style={{ color: colors.primaryBase }}
              onPress={() => {
                Linking.openURL('https://www.telios.io');
              }}>
              {'join our waitlist.'}
            </Text>
          </Text>
          <Input
            style={{ marginTop: spacing.lg }}
            onChangeText={onChange}
            value={code}
            error={null}
            label="Beta Code"
            placeholder="000000"
            autoFocus={false}
            autoCapitalize="none"
            autoCorrect={false}
            inputAccessoryViewID={accessoryId}
            loading={loadingVerify}
            iconRight={
              verifyResponse?.type === 'success'
                ? { name: 'checkmark-circle-outline', color: 'green' }
                : verifyResponse?.type === 'error'
                ? { name: 'close-circle-outline', color: 'red' }
                : null
            }
            onSubmitEditing={onSubmit}
            returnKeyType="done"
          />
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
    </>
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
