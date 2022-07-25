import React from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  View,
  ScrollView,
  Text,
  ViewStyle,
  StyleProp,
  Alert,
} from 'react-native';
import { MainStackParams, RootStackParams } from '../Navigator';
import { TableCell } from '../components/TableCell';
import { colors } from '../util/colors';
import { spacing } from '../util/spacing';
import { fonts } from '../util/fonts';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { useAppSelector } from '../hooks';
import { useSelector } from 'react-redux';
import { filterAliasesByNamespaceSelector } from '../store/aliasesSelectors';
import { RootState } from '../store';

export type AliasManageScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'aliasManage'>,
  NativeStackScreenProps<RootStackParams>
>;

export const AliasManageScreen = (props: AliasManageScreenProps) => {
  const { aliasNamespace } = useAppSelector(state => state.aliases);
  const aliases = useSelector((state: RootState) =>
    filterAliasesByNamespaceSelector(state, aliasNamespace[0].name),
  );

  const onAlias = (aliasKey: string) => {
    Alert.alert('Not implemented');
  };
  const onCreateNamespace = () => {
    props.navigation.navigate('newAliasNamespace');
  };
  const onAddAlias = () => {
    props.navigation.navigate('newAlias');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={{ margin: spacing.lg }}>
        <TableCell
          label="Namespace"
          caption={aliasNamespace[0]?.name || 'None set'}
          iconRight={{
            name: 'information-circle-outline',
            color: colors.primaryBase,
          }}
          onPress={() => Alert.alert('Not impelmented')}
        />
        {!aliasNamespace && (
          <Button
            title="Create Namespace"
            onPress={onCreateNamespace}
            style={{ marginTop: spacing.md }}
          />
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: spacing.xl,
          }}>
          <Text style={fonts.title3}>{'Aliases'}</Text>
          {aliasNamespace ? (
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
                  onPress={() => onAlias(alias.name)}
                />
              );
            })}
          </View>
        ) : (
          <EmptyAliases style={{ marginVertical: spacing.xxl }} />
        )}
      </View>
    </ScrollView>
  );
};

const EmptyAliases = (props: { style?: StyleProp<ViewStyle> }) => (
  <View style={[{ alignItems: 'center' }, props.style]}>
    <Icon name="at-outline" color={colors.skyLight} size={60} />
    <Text style={[fonts.large.regular, { color: colors.skyBase }]}>
      {'No Aliases Yet'}
    </Text>
  </View>
);
