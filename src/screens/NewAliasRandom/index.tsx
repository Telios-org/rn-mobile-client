import { useAppDispatch } from '../../hooks';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import styles from './styles';
import { fonts } from '../../util/fonts';
import { colors } from '../../util/colors';
import { Button } from '../../components/Button';
import { randomLetters, randomWords } from '../../util/randomNames';
import uuid from 'react-native-uuid';
import { registerAlias } from '../../store/thunks/aliases';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../../navigators/Navigator';
import { EMAIL_POSTFIX } from '../../constants/Constants';

export type NewAliasRandomScreenProps = NativeStackScreenProps<
  RootStackParams,
  'newAliasRandom'
>;

export default ({ navigation }: NewAliasRandomScreenProps) => {
  const dispatch = useAppDispatch();
  const [newRandomAlias, setNewRandomAlias] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await dispatch(
        registerAlias({
          domain: EMAIL_POSTFIX,
          address: newRandomAlias,
          fwdAddresses: [],
          disabled: false,
        }),
      ).unwrap();
      setIsLoading(false);
      navigation.goBack();
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Unable to create random alias');
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.scrollViewContent}>
        <Text style={fonts.regular.medium}>Random Alias</Text>
        <Text style={styles.note}>
          Note: random alias is not tied to any namespace
        </Text>
        <View style={styles.aliasLongName}>
          <Text style={[fonts.small.medium, { color: colors.inkLighter }]}>
            <Text style={{ color: colors.primaryBase }}>{newRandomAlias}</Text>
            {`@${EMAIL_POSTFIX}`}
          </Text>
        </View>
        <View style={styles.generateButtons}>
          <Button
            type="outline"
            size="small"
            title="UUID"
            onPress={() =>
              setNewRandomAlias(uuid.v4().toString().replaceAll('-', '.'))
            }
          />
          <Button
            type="outline"
            size="small"
            title="Letters"
            onPress={() => setNewRandomAlias(randomLetters(12))}
          />
          <Button
            type="outline"
            size="small"
            title="Words"
            onPress={() =>
              setNewRandomAlias(
                `${randomWords()}.${randomWords()}.${randomWords()}`,
              )
            }
          />
        </View>
        <Button
          disabled={!newRandomAlias}
          title="Create"
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.createBtn}
        />
      </View>
    </ScrollView>
  );
};
