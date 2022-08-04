import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { RootStackParams } from '../../Navigator';
// @ts-ignore
import envApi from '../../../env_api.json';
import styles from './styles';
import { fonts } from '../../util/fonts';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { aliasSelectorById } from '../../store/aliasesSelectors';
import { colors } from '../../util/colors';
import { Icon } from '../../components/Icon';
import moment from 'moment';
import { Button } from '../../components/Button';
import * as Clipboard from 'expo-clipboard';
import { useAppDispatch } from '../../hooks';
import { removeAliasFlow } from '../../store/aliases';
import DescriptionSection from './components/DescriptionSection';
import ForwardAddressesSection from './components/ForwardAddressesSection';
import CurrentStateSection from './components/CurrentStateSection';

export type AliasInfoScreenProps = NativeStackScreenProps<
  RootStackParams,
  'aliasInfo'
>;

const SeparatorLine = () => <View style={styles.separatorLine} />;

export const AliasInfoScreen = ({
  navigation,
  route,
}: AliasInfoScreenProps) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const dispatch = useAppDispatch();
  const aliasId = route.params.aliasId;
  const alias = useSelector((state: RootState) =>
    aliasSelectorById(state, aliasId),
  );

  const emailPostfix = envApi.postfix;

  const onPressDeleteAlias = async () => {
    if (alias) {
      setIsDeleteLoading(true);
      try {
        await dispatch(
          removeAliasFlow({
            aliasId,
            address: alias.name,
            domain: emailPostfix,
            namespaceName: alias.namespaceKey,
          }),
        );
      } catch (e) {
        Alert.alert('Error', 'Failed to delete alias');
      }
      setIsDeleteLoading(false);
    }
    navigation.goBack();
  };

  if (!alias) {
    return null;
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.sectionContainer}>
        <View style={styles.aliasLongNameContainer}>
          <View style={styles.aliasTextContainer}>
            <Text style={fonts.title3}>Alias</Text>
            <Text style={styles.lighterText}>
              {alias.namespaceKey}
              <Text style={{ color: colors.primaryBase }}>
                {alias.namespaceKey ? `#${alias.name}` : alias.name}
              </Text>
              {`@${emailPostfix}`}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              const aliasFull = alias.namespaceKey
                ? `${alias.namespaceKey}#${alias.name}@${emailPostfix}`
                : `${alias.name}@${emailPostfix}`;
              Clipboard.setString(aliasFull);
            }}>
            <Icon name="copy-outline" size={24} color={colors.inkLighter} />
          </Pressable>
        </View>
        {!!alias.namespaceKey && (
          <DescriptionSection
            aliasId={alias.aliasId}
            domain={emailPostfix}
            aliasDescription={alias.description}
          />
        )}
        <Text style={styles.lighterText}>
          Created at {moment(alias.createdAt).format('MMM D YYYY')}
        </Text>
      </View>
      <SeparatorLine />
      <View style={styles.sectionContainer}>
        <CurrentStateSection
          aliasId={alias.aliasId}
          domain={emailPostfix}
          aliasDisabled={alias.disabled}
        />
      </View>
      <SeparatorLine />
      <ForwardAddressesSection
        domain={emailPostfix}
        aliasId={alias.aliasId}
        aliasFwdAddresses={alias.fwdAddresses || []}
      />
      <SeparatorLine />
      <View style={styles.sectionContainer}>
        <Button
          title="Delete Alias"
          type="outline"
          loading={isDeleteLoading}
          onPress={onPressDeleteAlias}
          iconLeft={{
            name: 'md-trash-outline',
            size: 20,
            color: colors.error,
          }}
          titleStyle={{ color: colors.error }}
          style={styles.deleteButton}
        />
      </View>
    </ScrollView>
  );
};
