import React, { useEffect, useState } from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, ScrollView, Text, ViewStyle, StyleProp } from 'react-native';
import { MainStackParams, RootStackParams } from '../../Navigator';
import { TableCell } from '../../components/TableCell';
import { colors } from '../../util/colors';
import { spacing } from '../../util/spacing';
import { fonts } from '../../util/fonts';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { useAppSelector } from '../../hooks';
import { useSelector } from 'react-redux';
import { filterAliasesByNamespaceSelector } from '../../store/aliasesSelectors';
import { RootState } from '../../store';
import { AliasNamespace } from '../../store/aliases';
import { SingleSelectInput } from '../../components/SingleSelectInput';
import styles from './styles';
import useRandomAliases from '../../hooks/useRandomAliases';

export type AliasManageScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'aliasManage'>,
  NativeStackScreenProps<RootStackParams>
>;

export const AliasManageScreen = (props: AliasManageScreenProps) => {
  const latestNamespace = useAppSelector(
    state => state.aliases.latestNamespace,
  );
  const { namespaceNames, originalNamespaceNames } = useRandomAliases();
  const hasNamespaces = originalNamespaceNames.length > 0;
  const [selectedNamespace, setSelectedNamespace] = useState<
    AliasNamespace['name']
  >(namespaceNames[0]);
  const isSelectedRandom = selectedNamespace === 'random';
  const aliases = useSelector((state: RootState) =>
    filterAliasesByNamespaceSelector(state, selectedNamespace),
  );

  const onAlias = (aliasId: string, aliasName: string) => {
    props.navigation.navigate('aliasInfo', { aliasId, aliasName });
  };
  const onCreateNamespace = () => {
    props.navigation.navigate('newAliasNamespace');
  };
  const onAddAlias = () => {
    if (selectedNamespace) {
      props.navigation.navigate('newAlias', { namespace: selectedNamespace });
    }
  };
  const onAddRandomAlias = () => {
    setSelectedNamespace('random');
    props.navigation.navigate('newAliasRandom');
  };

  useEffect(() => {
    if (latestNamespace) {
      setSelectedNamespace(latestNamespace.name);
    } else {
      setSelectedNamespace(namespaceNames[0]);
    }
  }, [latestNamespace, namespaceNames]);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.scrollViewContent}>
        {!isSelectedRandom && (
          <View style={styles.sectionContainer}>
            <Text style={fonts.title3}>Namespace</Text>
            {hasNamespaces && (
              <Button
                size="small"
                title="Add"
                type="outline"
                iconRight={{ name: 'add-outline' }}
                onPress={onCreateNamespace}
              />
            )}
          </View>
        )}
        {namespaceNames.length > 0 && (
          <SingleSelectInput
            modalTitle="Select Namespace"
            options={namespaceNames.map(namespaceName => ({
              label: namespaceName,
              value: namespaceName,
              labelStyle:
                namespaceName === 'random' ? { color: colors.primaryBase } : {},
            }))}
            value={selectedNamespace}
            onSelect={value => {
              setSelectedNamespace(value);
            }}
          />
        )}
        {isSelectedRandom && (
          <Text style={styles.note}>
            Random aliases are not tied to a namespace.
          </Text>
        )}
        {originalNamespaceNames.length === 0 && (
          <Button
            title="Create Namespace"
            onPress={onCreateNamespace}
            style={{ marginTop: spacing.md }}
          />
        )}
        <View style={[styles.sectionContainer, { marginTop: spacing.xl }]}>
          <Text style={fonts.title3}>Aliases</Text>
          <Button
            type="outline"
            size="small"
            title="Add random"
            onPress={onAddRandomAlias}
          />
          {hasNamespaces && !isSelectedRandom ? (
            <Button
              size="small"
              title="Add"
              iconRight={{ name: 'add-outline' }}
              onPress={onAddAlias}
            />
          ) : null}
        </View>
        {aliases.length > 0 ? (
          <View>
            {aliases.map(alias => {
              return (
                <TableCell
                  key={`managealias-cell-${alias.aliasId}`}
                  label={`#${alias.name}`}
                  caption={alias.aliasId}
                  iconRight={
                    alias.fwdAddresses && alias.fwdAddresses.length > 0
                      ? {
                          name: 'return-up-forward-outline',
                          color: colors.skyDark,
                        }
                      : undefined
                  }
                  onPress={() => onAlias(alias.aliasId, alias.name)}
                />
              );
            })}
          </View>
        ) : (
          <EmptyAliases />
        )}
      </View>
    </ScrollView>
  );
};

const EmptyAliases = (props: { style?: StyleProp<ViewStyle> }) => (
  <View style={[styles.emptyAliasesContainer, props.style]}>
    <Icon name="at-outline" color={colors.skyLight} size={60} />
    <Text style={[fonts.large.regular, { color: colors.skyBase }]}>
      {'No Aliases Yet'}
    </Text>
  </View>
);
