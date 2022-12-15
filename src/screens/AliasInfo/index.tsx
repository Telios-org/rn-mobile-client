import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { RootStackParams } from '../../navigators/Navigator';
import { EMAIL_POSTFIX } from '../../constants/Constants';
import styles from './styles';
import { fonts } from '../../util/fonts';
import { colors } from '../../util/colors';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import * as Clipboard from 'expo-clipboard';
import { useAppDispatch, useAppSelector } from '../../hooks';
import DescriptionSection from './components/DescriptionSection';
import ForwardAddressesSection from './components/ForwardAddressesSection';
import CurrentStateSection from './components/CurrentStateSection';
import { removeAliasFlow } from '../../store/thunks/aliases';
import { aliasSelectors } from '../../store/adapters/aliases';
import { format } from 'date-fns';
import { showToast } from '../../util/toasts';

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
  const alias = useAppSelector(state =>
    aliasSelectors.selectById(state.aliases, aliasId),
  );

  const onPressDeleteAlias = async () => {
    if (alias) {
      setIsDeleteLoading(true);
      try {
        await dispatch(
          removeAliasFlow({
            aliasId: alias._id,
            address: alias.name,
            domain: EMAIL_POSTFIX,
            namespaceName: alias.namespaceKey,
          }),
        );
      } catch (e) {
        showToast('error', 'Failed to delete alias');
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
              {`@${EMAIL_POSTFIX}`}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              const aliasFull = alias.namespaceKey
                ? `${alias.namespaceKey}#${alias.name}@${EMAIL_POSTFIX}`
                : `${alias.name}@${EMAIL_POSTFIX}`;
              Clipboard.setString(aliasFull);
            }}>
            <Icon name="copy-outline" size={24} color={colors.inkLighter} />
          </Pressable>
        </View>
        {!!alias.namespaceKey && (
          <DescriptionSection
            aliasId={alias.aliasId}
            domain={EMAIL_POSTFIX}
            aliasDescription={alias.description}
          />
        )}
        {alias.createdAt && (
          <Text style={styles.lighterText}>
            Created {format(new Date(alias.createdAt), 'MMM dd yyyy')}
          </Text>
        )}
      </View>
      <SeparatorLine />
      <View style={styles.sectionContainer}>
        <CurrentStateSection
          aliasId={alias.aliasId}
          domain={EMAIL_POSTFIX}
          aliasDisabled={alias.disabled}
        />
      </View>
      <SeparatorLine />
      <ForwardAddressesSection
        domain={EMAIL_POSTFIX}
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
