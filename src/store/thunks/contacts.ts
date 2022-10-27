import { createNodeCalloutAsyncThunk } from '../../util/nodeActions';
import { Contact } from '../types';

export type GetAllContactsResponse = Array<Contact>;
export const getAllContacts = createNodeCalloutAsyncThunk<
  void,
  GetAllContactsResponse
>('contact:getAllContacts');

export type GetContactByIdRequest = {
  id: string;
};
export type GetContactByIdResponse = Contact;
export const getContactById = createNodeCalloutAsyncThunk<
  GetContactByIdRequest,
  GetContactByIdResponse
>('contact:getContactById');

export type CreateContactsRequest = {
  contactList: Array<Contact>;
};
export type CreateContactsResponse = any;
export const createContacts = createNodeCalloutAsyncThunk<
  CreateContactsRequest,
  CreateContactsResponse
>('contact:createContacts');

export type UpdateContactRequest = Contact & {
  id?: string;
};
export type UpdateContactResponse = any;
export const updateContact = createNodeCalloutAsyncThunk<
  UpdateContactRequest,
  UpdateContactResponse
>('contact:updateContact');

export type RemoveContactRequest = {
  id: string;
};
export type RemoveContactResponse = any;
export const removeContact = createNodeCalloutAsyncThunk<
  RemoveContactRequest,
  RemoveContactResponse
>('contact:removeContact');

export type SearchContactRequest = {
  searchQuery: string;
};
export type SearchContactResponse = any;
export const searchContact = createNodeCalloutAsyncThunk<
  SearchContactRequest,
  SearchContactResponse
>('contact:searchContact');
