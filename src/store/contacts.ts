import { createSlice, EntityState } from '@reduxjs/toolkit';
import { contactsAdapter } from './adapters/contacts';
import { accountLogout } from './thunks/accountLogout';
import {
  getAllContacts,
  getContactById,
  removeContact,
  searchContact,
} from './thunks/contacts';
import { Contact } from './types';

interface ContactState {
  contacts: EntityState<Contact> & {
    loading: boolean;
    error: any;
  };
  search: EntityState<Contact> & {
    loading: boolean;
    error: any;
  };
  contactById: {
    data?: Contact;
  };
}

const contactInitialState = {
  contacts: {
    ids: [],
    entities: {},
    loading: false,
    error: undefined,
  },
  search: {
    ids: [],
    entities: {},
    loading: false,
    error: undefined,
  },
  contactById: {
    data: undefined,
  },
} as ContactState;

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState: contactInitialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getAllContacts.pending, state => {
      state.contacts.loading = true;
    });
    builder.addCase(getAllContacts.fulfilled, (state, action) => {
      state.contacts.loading = false;
      contactsAdapter.setAll(state.contacts, action.payload);
    });
    builder.addCase(getAllContacts.rejected, state => {
      state.contacts.loading = false;
    });

    builder.addCase(getContactById.fulfilled, (state, action) => {
      state.contactById.data = action.payload;
    });

    builder.addCase(searchContact.pending, state => {
      state.search.loading = true;
    });
    builder.addCase(searchContact.fulfilled, (state, action) => {
      state.search.loading = false;
      contactsAdapter.setAll(state.search, action.payload);
    });
    builder.addCase(searchContact.rejected, state => {
      state.search.loading = false;
    });

    builder.addCase(removeContact.fulfilled, (state, action) => {
      contactsAdapter.removeOne(state.contacts, action?.meta?.arg?.id);
    });

    // clear state on logout
    builder.addCase(accountLogout.fulfilled, () => {
      return { ...contactInitialState };
    });
  },
});

export const contactsReducer = contactsSlice.reducer;
