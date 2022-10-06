import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getAliases,
  registerAlias,
  removeAliasFlow,
  updateAliasCountFlow,
} from './thunks/aliases';
import { aliasAdapter } from './adapters/aliases';
import { accountLogout } from './thunks/accountLogout';
import _ from 'lodash';

export const aliasesSlice = createSlice({
  name: 'aliases',
  initialState: aliasAdapter.getInitialState(),
  reducers: {
    addAlias: aliasAdapter.setOne,
  },
  extraReducers: builder => {
    builder.addCase(getAliases.fulfilled, aliasAdapter.setMany);
    builder.addCase(registerAlias.fulfilled, aliasAdapter.addOne);
    builder.addCase(
      removeAliasFlow.fulfilled,
      (state, action: PayloadAction<string | undefined>) => {
        if (action.payload) {
          aliasAdapter.removeOne(state, action.payload);
        }
      },
    );
    builder.addCase(updateAliasCountFlow.fulfilled, (state, action) => {
      const aliasId = _.findKey(state.entities, ['aliasId', action.payload.id]);
      if (aliasId) {
        aliasAdapter.updateOne(state, {
          id: aliasId,
          changes: {
            count:
              (state.entities[aliasId]?.count || 0) + action.payload.amount,
          },
        });
      }
    });
    // clear state on logout
    builder.addCase(accountLogout.fulfilled, () => {
      return aliasAdapter.getInitialState();
    });
  },
});

export const aliasesReducer = aliasesSlice.reducer;
