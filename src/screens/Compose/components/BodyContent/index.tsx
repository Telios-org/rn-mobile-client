import React, { forwardRef, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { spacing } from '../../../../util/spacing';
import { colors } from '../../../../util/colors';
import { textStyles } from '../../../../util/fonts';
import BodyWebView from '../../../../components/BodyWebView';

interface BodyContentProps {
  initialBodyAsText?: string;
  bodyAsHtml?: string;
  onHTMLChange?: (html: string) => void;
  onEndEditing?: (subject: string) => void;
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: spacing.md,
    marginVertical: spacing.md,
    backgroundColor: colors.white,
    color: textStyles.defaultColor,
    fontSize: textStyles.sizes.regular,
    fontWeight: textStyles.weights.regular,
  },
  bodyWebView: { marginHorizontal: spacing.md },
});

export default forwardRef<TextInput, BodyContentProps>(
  (
    { initialBodyAsText, bodyAsHtml, onHTMLChange, onEndEditing },
    bodyInputRef,
  ) => {
    const [bodyText, setBodyText] = useState(initialBodyAsText);
    return (
      <>
        {bodyAsHtml ? (
          <BodyWebView
            contentEditable
            bodyAsHtml={bodyAsHtml}
            onMessage={e => onHTMLChange?.(e.nativeEvent.data)}
            style={styles.bodyWebView}
          />
        ) : (
          <TextInput
            ref={bodyInputRef}
            multiline={true}
            value={bodyText}
            onChangeText={setBodyText}
            onEndEditing={e => onEndEditing && onEndEditing(e.nativeEvent.text)}
            style={styles.input}
          />
        )}
      </>
    );
  },
);
