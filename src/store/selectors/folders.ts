import { RootState } from '../../store';
import { folderSelectors } from '../adapters/folders';

export const foldersSelector = (state: RootState) =>
  folderSelectors.selectAll(state.folders);
