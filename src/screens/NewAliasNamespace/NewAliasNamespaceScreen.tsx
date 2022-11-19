import React, { useRef, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, Text, View } from 'react-native';
import { RootStackParams } from '../../navigators/Navigator';
import { fonts } from '../../util/fonts';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
// @ts-ignore
import envApi from '../../../env_api.json';
import { randomLetters, randomWords } from '../../util/randomNames';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { registerNamespace } from '../../store/thunks/namespaces';
import { selectMailBoxId } from '../../store/selectors/email';
import styles from './styles';
import { showToast } from '../../util/toasts';
import { Modalize } from 'react-native-modalize';

export type NewAliasNamespaceScreenProps = NativeStackScreenProps<
  RootStackParams,
  'newAliasNamespace'
>;

export const NewAliasNamespaceScreen = (
  props: NewAliasNamespaceScreenProps,
) => {
  const dispatch = useAppDispatch();
  const mailboxId = useAppSelector(selectMailBoxId);
  const moreInfoRef = useRef<Modalize>();
  const [namespace, setNamespace] = useState(randomLetters());
  const [loadingCreate, setLoadingCreate] = useState(false);

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
      showToast('error', 'Unable to create namespace');
    } else {
      props.navigation.goBack();
    }
  };
  const onMoreInfo = () => {
    moreInfoRef.current?.open();
  };

  const onRandomLetters = () => {
    setNamespace(randomLetters());
  };
  const onRandomWords = () => {
    setNamespace(randomWords(2));
  };

  // TODO: dev vs prod switch
  const emailPostfix = envApi.prodMail;

  const moreInfoModal = (
    <Modalize
      adjustToContentHeight
      ref={moreInfoRef}
      childrenStyle={styles.modal}>
      <Text style={styles.moreInfoTxt}>
        <Text style={styles.moreInfoBold}>Note: </Text>
        Namespaces are NOT currently DELETABLE so chose wisely!
      </Text>
      <Text style={styles.moreInfoTxt}>
        <Text style={styles.moreInfoBold}>Tip: </Text>A namespace allows you to
        do ON THE FLY alias creation. On any website you can use an email you
        made up on the spot with that namespace. i.e
        namespace+sickblog@telios.io that folder will create once it receives it
        first email.
      </Text>
      <Text style={styles.moreInfoTxt}>
        <Text style={styles.moreInfoBold}>i.e: </Text>
        namespace+sickblog@telios.io that folder will create as soon as its
        receives it first email
      </Text>
      <Button
        title="I get it"
        onPress={() => moreInfoRef.current?.close()}
        style={styles.moreInfoModalBtn}
      />
    </Modalize>
  );

  return (
    <>
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
      {moreInfoModal}
    </>
  );
};
