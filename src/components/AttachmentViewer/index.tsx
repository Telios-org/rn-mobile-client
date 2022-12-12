import React, { useState } from 'react';
import { View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import FileViewer from 'react-native-file-viewer';
import { useAppDispatch } from '../../hooks';
import { Attachment } from '../../store/types';
import { showToast } from '../../util/toasts';
import { saveFile } from '../../store/thunks/email';
import { colors } from '../../util/colors';
import Tag from '../AutocompleteInput/components/Tag';
import styles from './styles';

const CACHE_DIR = FileSystem.cacheDirectory + 'TeliosAttachments/';
const CACHE_DIR_PATH = CACHE_DIR.replace('file://', '');
export default ({ attachments }: { attachments: Attachment[] }) => {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const dispatch = useAppDispatch();

  const handleSaveFile = async (attachment: Attachment, filePath: string) => {
    await dispatch(
      saveFile({
        filepath: filePath,
        attachments: [attachment],
      }),
    ).unwrap();
  };

  const onPressTag = async (attachment: Attachment) => {
    const filePath = CACHE_DIR_PATH + attachment.filename;
    try {
      await handleSaveFile(attachment, filePath);
      await FileViewer.open(filePath);
    } catch (e) {
      showToast('error', 'Error opening attachment');
    }
  };

  if (attachments.length > 0) {
    return (
      <View style={styles.attachmentContainer}>
        {attachments.map((attachment, index) => (
          <Tag
            key={index}
            onPress={async () => {
              setLoadingIndex(index);
              await onPressTag(attachment);
              setLoadingIndex(null);
            }}
            loading={index === loadingIndex}
            label={attachment.filename}
            containerStyle={styles.tagContainer}
            iconProps={{
              name: 'document-attach-outline',
              size: 18,
              color: colors.primaryBase,
              style: styles.tagIcon,
            }}
          />
        ))}
      </View>
    );
  }
  return null;
};
