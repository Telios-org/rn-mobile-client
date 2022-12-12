import React, { useState } from 'react';
import { colors } from '../../../util/colors';
import { Attachment } from '../../../store/types';
import { Pressable, StyleSheet, View } from 'react-native';
import Tag from '../../../components/AutocompleteInput/components/Tag';
import DocumentPicker, { isInProgress } from 'react-native-document-picker';
import * as FileSystem from 'expo-file-system';
import { Icon } from '../../../components/Icon';
import { spacing } from '../../../util/spacing';

interface AttachmentOptions {
  attachments: Attachment[];
  attachmentsTags: React.ReactNode;
  attachmentIcon: React.ReactNode;
}

const styles = StyleSheet.create({
  attachmentContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginTop: 3,
    paddingHorizontal: spacing.md,
  },
});

export default (initialAttachments?: Attachment[]): AttachmentOptions => {
  const [attachments, setAttachments] = useState<Attachment[]>(
    initialAttachments || [],
  );

  const handlePickerError = (error: any) => {
    if (DocumentPicker.isCancel(error)) {
      // ignore
    } else if (isInProgress(error)) {
      // Ignore
    }
  };
  const onSelectAttachments = async () => {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: [DocumentPicker.types.allFiles],
      });
      if (pickerResult) {
        const { uri, name: filename, type: mimetype, size } = pickerResult;
        const content = await FileSystem.readAsStringAsync(uri, {
          encoding: 'base64',
        });
        setAttachments(prev => [
          ...prev,
          {
            content,
            filename: filename || 'file' + Math.random() * 1000,
            mimetype: mimetype || undefined,
            size: size || undefined,
          },
        ]);
      }
    } catch (e) {
      handlePickerError(e);
      // showToast('error', 'Error while attaching file');
    }
  };

  const attachmentIcon = (
    <Pressable onPress={onSelectAttachments}>
      <Icon name="attach" size={24} color={colors.primaryBase} />
    </Pressable>
  );

  const attachmentsTags = attachments.length > 0 && (
    <View style={styles.attachmentContainer}>
      {attachments.map((attachment, index) => (
        <Tag
          key={index}
          onPress={() =>
            setAttachments(prev => prev.filter((att, i) => i !== index))
          }
          label={attachment.filename}
        />
      ))}
    </View>
  );

  return {
    attachments,
    attachmentsTags,
    attachmentIcon,
  };
};
