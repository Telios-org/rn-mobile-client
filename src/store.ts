import { configureStore } from '@reduxjs/toolkit';
import { eventListenerMiddleware } from './eventListenerMiddleware';
import { mainReducer } from './mainSlice';

export const store = configureStore({
  reducer: {
    main: mainReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(eventListenerMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
