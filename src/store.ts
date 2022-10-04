import { configureStore } from '@reduxjs/toolkit';
import { eventListenerMiddleware } from './eventListenerMiddleware';
import { fileFetchedMiddleware } from './fileFetchedMiddleware';
import { accountReducer } from './store/account';
import { aliasesReducer } from './store/aliases';
import { contactsReducer } from './store/contacts';
import { systemReducer } from './store/system';
import { namespacesReducer } from './store/namespaces';
import { emailReducer } from './store/emails';
import { foldersReducer } from './store/folders';
import { searchReducer } from './store/search';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    aliases: aliasesReducer,
    namespaces: namespacesReducer,
    contacts: contactsReducer,
    mail: emailReducer,
    folders: foldersReducer,
    system: systemReducer,
    search: searchReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(eventListenerMiddleware)
      .concat(fileFetchedMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
