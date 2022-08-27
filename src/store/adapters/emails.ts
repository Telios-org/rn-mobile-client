import { createEntityAdapter } from '@reduxjs/toolkit';
import { Email } from '../types';

export const emailAdapter = createEntityAdapter<Email>({
  selectId: (email: Email) => email.emailId,
  sortComparer: (a, b) =>
    new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
});

export const emailSelectors = emailAdapter.getSelectors();
