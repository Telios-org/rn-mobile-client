import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, ScrollView, Text, View } from 'react-native';

import { RootStackParams } from '../Navigator';
import { colors } from '../util/colors';
import { borderRadius, spacing } from '../util/spacing';
import { fonts } from '../util/fonts';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

import envApi from '../../env_api.json';
import { Icon } from '../components/Icon';
import { randomLetters, randomWords } from '../util/randomNames';
import { useAppDispatch, useAppSelector } from '../hooks';
import { registerNamespace } from '../mainSlice';

export type AliasNewNamespaceScreenProps = NativeStackScreenProps<
  RootStackParams,
  'aliasNewNamespace'
>;

export const AliasNewNamespaceScreen = (
  props: AliasNewNamespaceScreenProps,
) => {
  const dispatch = useAppDispatch();
  const mainState = useAppSelector(state => state.main);

  const [namespace, setNamespace] = React.useState(randomLetters());
  const [loadingCreate, setLoadingCreate] = React.useState(false);

  const onCreate = async () => {
    const mailboxId = mainState.mailbox._id;
    if (!mailboxId) {
      return;
    }
    setLoadingCreate(true);
    const response = await dispatch(
      registerNamespace({ mailboxId, namespace }),
    );
    setLoadingCreate(false);
    if (response.type === registerNamespace.rejected.type) {
      // todo specific error here
      Alert.alert('Error', 'Unable to create namespace');
    } else {
      props.navigation.goBack();
    }
  };
  const onMoreInfo = () => {
    // todo helper text
    Alert.alert('Not implemented');
  };

  const onRandomLetters = () => {
    setNamespace(randomLetters());
  };
  const onRandomWords = () => {
    setNamespace(randomWords(2));
  };

  // TODO: dev vs prod switch
  const emailPostfix = envApi.devMail;

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <View style={{ margin: spacing.lg }}>
        <Text
          style={
            fonts.small.regular
          }>{`To create aliases you first need to create a namespace. This will be the basis for all your aliases:`}</Text>
        <View
          style={{
            backgroundColor: colors.skyLighter,
            borderRadius: borderRadius,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            marginTop: spacing.md,
          }}>
          <Text style={[fonts.small.medium, { color: colors.inkLighter }]}>
            <Text style={{ color: colors.primaryBase }}>
              {namespace ? namespace : 'namespace'}
            </Text>
            {`#myalias@${emailPostfix}`}
          </Text>
        </View>
        <Input
          style={{ marginTop: spacing.xl }}
          value={namespace}
          label="Choose a Namespace"
          onChangeText={text => setNamespace(text)}
          autoCapitalize="none"
          autoCorrect={false}
          disabled={loadingCreate}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: spacing.sm,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="shuffle-outline" size={20} color={colors.inkLighter} />
            <Text
              style={[
                fonts.small.medium,
                { color: colors.inkLighter, marginLeft: spacing.sm },
              ]}>
              {'Shuffle'}
            </Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Button
              type="outline"
              size="small"
              title="Letters"
              onPress={onRandomLetters}
            />
            <Button
              type="outline"
              size="small"
              title="Words"
              onPress={onRandomWords}
              style={{ marginLeft: spacing.sm }}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: spacing.lg,
          }}>
          <Button
            size="small"
            type="text"
            title="more info"
            onPress={onMoreInfo}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: spacing.lg,
          }}>
          <Text style={fonts.small.regular}>
            {"This can't be changed after creation"}
          </Text>
        </View>
        <Button
          title="Create"
          onPress={onCreate}
          loading={loadingCreate}
          style={{ marginTop: spacing.sm }}
        />
      </View>
    </ScrollView>
  );
};
