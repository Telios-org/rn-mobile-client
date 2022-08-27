import { RootState } from '../../store';
import { folderSelectors } from '../adapters/folders';
// import { createDeepEqualSelector } from './utils';

export const foldersSelector = (state: RootState) =>
  folderSelectors.selectAll(state.folders);

// export const folderNameSelector = createDeepEqualSelector(
//   (state: RootState) => folderSelectors.selectAll(state.folders),
//   folders => folders.map(folder => folder.name),
// );
