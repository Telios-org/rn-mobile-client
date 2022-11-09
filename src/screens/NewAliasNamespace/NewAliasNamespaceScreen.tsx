import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, ScrollView, Text, View } from 'react-native';
import { RootStackParams } from '../../navigators/Navigator';
import { colors } from '../../util/colors';
import { fonts } from '../../util/fonts';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
// @ts-ignore
import envApi from '../../../env_api.json';
import { Icon } from '../../components/Icon';
import { randomLetters, randomWords } from '../../util/randomNames';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { registerNamespace } from '../../store/thunks/namespaces';
import { selectMailBoxId } from '../../store/selectors/email';
import styles from './styles';

export type NewAliasNamespaceScreenProps = NativeStackScreenProps<
  RootStackParams,
  'newAliasNamespace'
>;

export const NewAliasNamespaceScreen = (
  props: NewAliasNamespaceScreenProps,
) => {
  const dispatch = useAppDispatch();
  const mailboxId = useAppSelector(selectMailBoxId);

  const [namespace, setNamespace] = React.useState(randomLetters());
  const [loadingCreate, setLoadingCreate] = React.useState(false);

  const onCreate = async () => {
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
  const emailPostfix = envApi.prodMail;

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.scrollViewContent}>
        <Text style={fonts.small.regular}>
          To create aliases you first need to create a namespace. This will be
          the basis for all your aliases:
        </Text>
        <View style={styles.namespaceSampleContainer}>
          <Text style={styles.namespaceSampleTxt}>
            <Text style={styles.namespaceSampleColor}>
              {namespace ? namespace : 'namespace'}
            </Text>
            {`#myalias@${emailPostfix}`}
          </Text>
        </View>
        <Input
          style={styles.namespaceInput}
          value={namespace}
          label="Choose a Namespace"
          onChangeText={text => setNamespace(text)}
          autoCapitalize="none"
          autoCorrect={false}
          disabled={loadingCreate}
        />
        <View style={styles.shuffleButtonsContainer}>
          <View style={styles.shuffleBtn}>
            <Icon name="shuffle-outline" size={20} color={colors.inkLighter} />
            <Text style={styles.shuffleBtnTitle}>{'Shuffle'}</Text>
          </View>

          <View style={styles.wordsAndLettersContainer}>
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
              style={styles.shuffleWordsBtn}
            />
          </View>
        </View>
        <View style={styles.moreInfoBtnContainer}>
          <Button
            size="small"
            type="text"
            title="more info"
            onPress={onMoreInfo}
          />
        </View>
        <View style={styles.warningTxt}>
          <Text style={fonts.small.regular}>
            {"This can't be changed after creation"}
          </Text>
        </View>
        <Button
          title="Create"
          onPress={onCreate}
          loading={loadingCreate}
          style={styles.createBtn}
        />
      </View>
    </ScrollView>
  );
};
