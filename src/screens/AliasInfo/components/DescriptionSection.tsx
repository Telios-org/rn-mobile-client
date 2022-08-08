import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch } from '../../../hooks';
import { spacing } from '../../../util/spacing';
import { Input } from '../../../components/Input';
import { colors } from '../../../util/colors';
import { fonts } from '../../../util/fonts';
import { SectionPropsType } from './SectionPropsType';
import { updateAliasFlow } from '../../../store/thunks/aliases';
import { Alias } from '../../../store/types';

const styles = StyleSheet.create({
  descriptionContainer: {
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    flex: 1,
    marginRight: 5,
  },
  textInputStyle: {
    borderWidth: 0,
    borderRadius: 0,
    paddingLeft: 0,
  },
  lighterText: {
    ...fonts.small.regular,
    color: colors.inkLighter,
  },
  editIcon: { zIndex: 100 },
});

interface DescriptionSectionProps extends SectionPropsType {
  aliasDescription: Alias['description'];
}
export default ({
  aliasId,
  aliasDescription,
  domain,
}: DescriptionSectionProps) => {
  const dispatch = useAppDispatch();
  let inputRef = useRef<TextInput>(null);
  const [editInput, setEditInput] = useState(false);
  const [isInputSubmitted, setIsInputSubmitted] = useState(false);
  const [description, setDescription] = useState(aliasDescription);

  const onEditDescription = () => {
    setEditInput(true);
  };

  useEffect(() => {
    if (editInput) {
      inputRef.current?.focus();
    }
  }, [editInput]);

  useEffect(() => {
    const keyboardHideSubscription = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        if (!isInputSubmitted) {
          setDescription(aliasDescription);
        }
        setIsInputSubmitted(false);
        setEditInput(false);
      },
    );
    return () => keyboardHideSubscription.remove();
  }, [isInputSubmitted, aliasDescription]);

  return (
    <View style={styles.descriptionContainer}>
      <Input
        ref={inputRef}
        placeholder="Add a description"
        value={description}
        onChangeText={setDescription}
        editable={editInput}
        autoFocus={editInput}
        autoComplete="off"
        multiline
        returnKeyType="done"
        blurOnSubmit
        textInputStyle={
          !editInput && [styles.textInputStyle, styles.lighterText]
        }
        style={styles.description}
        onSubmitEditing={() => {
          if (description !== aliasDescription) {
            dispatch(
              updateAliasFlow({
                aliasId,
                domain,
                description,
              }),
            );
            setIsInputSubmitted(true);
          }
        }}
      />
      <Pressable onPress={onEditDescription} style={styles.editIcon}>
        <Feather name="edit" size={24} color={colors.inkLighter} />
      </Pressable>
    </View>
  );
};
