import { createEntityAdapter } from '@reduxjs/toolkit';
import { Folder } from '../types';

export const folderAdapter = createEntityAdapter<Folder>({
  selectId: folder => folder.folderId,
});

export const folderSelectors = folderAdapter.getSelectors();
