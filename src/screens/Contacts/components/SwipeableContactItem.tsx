import React from 'react';

import ContactCell from '../../../components/ContactCell/ContactCell';
import { SwipeableRow } from '../../../components/SwipeRow/SwipeRow';
import { Contact } from '../../../store/types';

import { colors } from '../../../util/colors';

type SwipeableContactItemProps = {
  contact: Contact;
  enabled?: boolean;
  onPress: (arg0: string) => void;
  onPressEdit: (arg0: string) => void;
  onPressDelete: (arg0: string) => void;
};

export const SwipeableContactItem = ({
  contact,
  onPressEdit,
  onPressDelete,
  onPress,
}: SwipeableContactItemProps) => {
  const contactId: string = contact.contactId;

  const handleOnPressEdit = () => onPressEdit?.(contactId);

  const handleOnPressDelete = () => onPressDelete?.(contactId);

  const handleOnPressContent = () => onPress?.(contactId);

  return (
    <SwipeableRow
      rightButtons={[
        {
          title: 'Edit',
          onPress: handleOnPressEdit,
          width: 64,
          background: colors.secondaryLight,
        },
        {
          title: 'Delete',
          onPress: handleOnPressDelete,
          width: 64,
          background: colors.error,
        },
      ]}
      itemKey={contactId}>
      <ContactCell
        email={contact.email}
        name={`${contact.givenName} ${contact.familyName}`}
        onPress={handleOnPressContent}
      />
    </SwipeableRow>
  );
};
