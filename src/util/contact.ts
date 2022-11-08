import { Contact } from '../store/types';

export const getFirstCharOfValidParameter = (contact: Contact): string => {
  let displayName = '';

  if (contact.givenName) {
    displayName = contact.givenName;
  } else if (contact.familyName) {
    displayName = contact.familyName;
  } else if (contact.email) {
    displayName = contact.email;
  }

  return displayName?.[0];
};
