import { RootState } from '../../store';
import { contactsSelectors } from '../adapters/contacts';

export const contactsSelector = (state: RootState) =>
  contactsSelectors.selectAll(state.contacts.contacts);

export const searchContactsSelector = (state: RootState) =>
  contactsSelectors.selectAll(state.contacts.search);

export const selectedContactSelector = (state: RootState) =>
  state.contacts?.contactById?.data;
