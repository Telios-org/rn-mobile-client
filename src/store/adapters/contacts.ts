import { createEntityAdapter } from '@reduxjs/toolkit';
import { Contact } from '../types';

export const contactsAdapter = createEntityAdapter<Contact>({
  selectId: contact => contact.contactId,
});
export const contactsSelectors = contactsAdapter.getSelectors();
