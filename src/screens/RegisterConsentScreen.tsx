import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useHeaderHeight } from '@react-navigation/elements';

import React, { ReactNode } from 'react';
import {
  View,
  Text,
  ScrollView,
  InputAccessoryView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Linking,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { RegisterStackParams, RootStackParams } from '../Navigator';
import { fonts } from '../util/fonts';
import { spacing } from '../util/spacing';
import { colors } from '../util/colors';
import { Result } from '../util/types';
import envApi from '../../env_api.json';
import { debounce } from 'lodash';
import { Icon } from '../components/Icon';

const urlTermsOfService =
  'https://docs.google.com/document/u/1/d/e/2PACX-1vQXqRRpBkB-7HqwLd2XtsWVDLjCUnBUIeNQADb56FuKHdj_IF9wbmsl4G7RLxR2_yKYMhnSO1M-X39H/pub';
const urlPrivacyPolicy =
  'https://docs.google.com/document/u/1/d/e/2PACX-1vTIL7a6NbUhBDxHmRy5tW0e5H4YoBWXUO1WvPseVuEATSLHMIemVAG6nnRe_xIJZ-s5YYPh2C05JwKR/pub';

export type RegisterConsentScreenProps = NativeStackScreenProps<
  RegisterStackParams,
  'registerConsent'
>;

export const RegisterConsentScreen = (props: RegisterConsentScreenProps) => {
  const { code } = props.route.params;
  const headerHeight = useHeaderHeight();

  const [selected1, setSelected1] = React.useState(false);
  const [selected2, setSelected2] = React.useState(false);

  const isValid = selected1 && selected2;

  const onSubmit = () => {
    if (!isValid) {
      return;
    }
    props.navigation.navigate('registerUsername', { code, accepted: true });
  };

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}
        contentContainerStyle={{ marginTop: headerHeight, flexGrow: 1 }}>
        <View style={{ margin: spacing.lg, flex: 1 }}>
          <Text style={fonts.title2}>{'Beta Consent'}</Text>

          <CheckmarkRow
            selected={selected1}
            onPress={() => {
              setSelected1(!selected1!);
            }}
            style={{ marginTop: spacing.xl }}>
            <Text
              style={
                fonts.small.regular
              }>{`I understand that my Telios account will receive occasional emails containing
important product updates and surveys that will help us make this beta a success.
Telios will never sell or distribute your email address to any third party at any time.
If you wish to unsubscribe from future emails, you can do so at any time.`}</Text>
          </CheckmarkRow>

          <CheckmarkRow
            selected={selected2}
            onPress={() => {
              setSelected2(!selected2!);
            }}
            style={{ marginTop: spacing.xl }}>
            <Text style={fonts.small.regular}>
              {`I agree to the Telios `}
              <Text
                style={{ color: colors.primaryBase }}
                onPress={() => {
                  Linking.openURL(urlTermsOfService);
                }}>{`Terms of Service`}</Text>
              {` and `}
              <Text
                style={{ color: colors.primaryBase }}
                onPress={() => {
                  Linking.openURL(urlPrivacyPolicy);
                }}>{`Privacy Policy`}</Text>
            </Text>
          </CheckmarkRow>

          <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
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
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const CheckmarkRow = (props: {
  onPress: () => void;
  selected?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View style={[{ flexDirection: 'row' }, props.style]}>
      <TouchableOpacity
        onPress={props.onPress}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: props.selected ? 'green' : colors.skyLight,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: spacing.md,
        }}>
        <Icon name="checkmark-outline" size={25} color={colors.white} />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>{props.children}</View>
    </View>
  );
};
