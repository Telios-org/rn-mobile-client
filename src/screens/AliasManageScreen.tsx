import React from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, ScrollView, Text, ViewStyle, StyleProp } from 'react-native';
import { MainStackParams, RootStackParams } from '../Navigator';
// import { ScrollView } from 'react-native-gesture-handler';
import { TableCell } from '../components/TableCell';
import { colors } from '../util/colors';
import { spacing } from '../util/spacing';
import { fonts } from '../util/fonts';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { useAppSelector } from '../hooks';

export type AliasManageScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'aliasManage'>,
  NativeStackScreenProps<RootStackParams>
>;

export const AliasManageScreen = (props: AliasManageScreenProps) => {
  const mainState = useAppSelector(state => state.main);

  const namespace = mainState.aliasNamespace;
  const aliases = []; // todo

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
          caption={namespace?.name || 'None set'}
          iconRight={{
            name: 'information-circle-outline',
            color: colors.primaryBase,
          }}
        />
        {!namespace && (
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
          {namespace ? (
            <Button
              size="small"
              title="Add"
              iconRight={{ name: 'add-outline' }}
              onPress={onAddAlias}
            />
          ) : null}
        </View>
        <EmptyAliases style={{ marginVertical: spacing.xxl }} />
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
