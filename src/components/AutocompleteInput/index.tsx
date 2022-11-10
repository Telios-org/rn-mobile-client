import React, { useRef, useState } from 'react';
import {
  FlatList,
  FlatListProps,
  ListRenderItemInfo,
  NativeSyntheticEvent,
  Pressable,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TextInputProps,
  TextInputSubmitEditingEventData,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import styles from './styles';
import Tag from './components/Tag';
import { validateEmail } from '../../util/regexHelpers';
import Toast from 'react-native-toast-message';

export interface AutocompleteInputProps {
  tags: string[];
  suggestions?: string[];
  onChangeTags: (newTags: string[]) => void;
  onTagPress?: (tag: string) => void;
  /** an array of characters that should trigger a new tag and clear the TextInput */
  parseChars?: string[];
  onAddNewTag?: (userInput: string) => void;
  allowCustomTags?: boolean;
  onSuggestionPress?: (suggestion: string) => void;
  filterSuggestions?: (text: string) => string[];
  renderTag?: (tag: string, onPress: (tag: string) => void) => JSX.Element;
  renderSuggestion?: (
    suggestion: string,
    onPress: (tag: string) => void,
  ) => JSX.Element;
  inputProps?: Partial<TextInputProps>;
  flatListProps?: Partial<FlatListProps<any>>;
  containerStyle?: ViewStyle;
  tagContainerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  flatListStyle?: ViewStyle;
}

export const AutocompleteTags = ({
  tags,
  suggestions = [],
  onChangeTags,
  onTagPress,
  parseChars,
  onAddNewTag,
  onSuggestionPress,
  filterSuggestions,
  renderTag,
  renderSuggestion,
  containerStyle,
  tagContainerStyle,
  inputStyle,
  flatListStyle,
  inputProps,
  flatListProps,
}: AutocompleteInputProps) => {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const [showPreview, setShowPreview] = useState(true);

  const handleTagPress = (tag: string) => {
    if (onTagPress) {
      onTagPress(tag);
    } else {
      onChangeTags(tags.filter(t => t !== tag));
    }
  };
  const handleSuggestionPress = (suggestion: string) => {
    setText('');
    if (onSuggestionPress) {
      onSuggestionPress(suggestion);
    } else {
      onChangeTags([...tags, suggestion]);
    }
    inputRef.current?.focus();
  };
  const handleTextChange = (input: string) => {
    setText(input);
    if (parseChars) {
      const lastTyped = input.charAt(input.length - 1);
      if (parseChars.indexOf(lastTyped) > -1) {
        setText('');
        const label = input.slice(0, -1);
        if (onAddNewTag) {
          onAddNewTag(label);
        } else {
          onChangeTags([...tags, label]);
        }
      }
    }
  };
  const renderTagComponent = (tag: string) => {
    const onPress = () => handleTagPress(tag);
    if (renderTag) {
      return renderTag(tag, onPress);
    }
    return (
      <Tag label={tag} key={tag + Math.random() * 1000} onPress={onPress} />
    );
  };
  const renderSuggestionComponent = ({ item }: ListRenderItemInfo<string>) => {
    const onPress = () => handleSuggestionPress(item);
    if (renderSuggestion) {
      return renderSuggestion(item, onPress);
    }
    return <Tag label={item} onPress={onPress} />;
  };
  const onKeyPress = ({
    nativeEvent: { key },
  }: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (text !== '' || key !== 'Backspace' || tags.length < 1) {
      return;
    }
    const updatedTags = [...tags];
    updatedTags.pop();
    onChangeTags(updatedTags);
  };
  const getSuggestions = () => {
    if (filterSuggestions) {
      return filterSuggestions(text);
    }
    if (!text || text === '') {
      return [];
    }
    return suggestions?.filter(item => item.search(text.trim()) >= 0);
  };
  const onSubmitEditing = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    if (e.nativeEvent.text !== '') {
      if (validateEmail(e.nativeEvent.text.trim())) {
        setText('');
        onChangeTags([...tags, e.nativeEvent.text.trim()]);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Invalid email',
          text2: 'Please enter a valid email address.',
        });
      }
    }
  };
  const onInputBlur = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    if (validateEmail(e.nativeEvent.text.trim())) {
      setText('');
      onChangeTags([...tags, e.nativeEvent.text.trim()]);
      setShowPreview(true);
    } else {
      if (e.nativeEvent.text !== '') {
        Toast.show({
          type: 'error',
          text1: 'Invalid email',
          text2: 'Please enter a valid email address.',
          onPress: () => Toast.hide(),
        });
        inputRef.current?.focus();
      } else {
        setShowPreview(true);
      }
    }
  };
  const onInputFocus = () => {
    setShowPreview(false);
  };
  const numberOfRecipients = tags.length;

  return (
    <View style={[styles.container, containerStyle]}>
      {showPreview && numberOfRecipients > 0 ? (
        <Pressable
          onPress={() => {
            setShowPreview(false);
          }}>
          <Text style={styles.previewText}>
            {`${tags[0]} ${
              numberOfRecipients > 1 ? `and ${numberOfRecipients - 1} more` : ''
            }`}
          </Text>
        </Pressable>
      ) : (
        <View style={[styles.tagContainer, tagContainerStyle]}>
          {tags.map(tag => renderTagComponent(tag))}
          <TextInput
            ref={inputRef}
            value={text}
            onKeyPress={onKeyPress}
            onChangeText={handleTextChange}
            style={[styles.input, inputStyle]}
            onSubmitEditing={onSubmitEditing}
            blurOnSubmit={false}
            onBlur={onInputBlur}
            onFocus={onInputFocus}
            {...inputProps}
          />
        </View>
      )}

      <View>
        <FlatList<string>
          data={getSuggestions()}
          keyExtractor={item => item + Math.random() * 1000}
          renderItem={renderSuggestionComponent}
          keyboardShouldPersistTaps="handled"
          style={[styles.list, flatListStyle]}
          {...flatListProps}
        />
      </View>
    </View>
  );
};

export default AutocompleteTags;
