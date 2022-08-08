import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAliases, registerAlias, removeAliasFlow } from './thunks/aliases';
import { aliasAdapter } from './adapters/aliases';
import { accountLogout } from './thunks/accountLogout';

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
    // clear state on logout
    builder.addCase(accountLogout.fulfilled, () => {
      return aliasAdapter.getInitialState();
    });
  },
});

export const aliasesReducer = aliasesSlice.reducer;
