import { configureStore } from '@reduxjs/toolkit';
import { eventListenerMiddleware } from './eventListenerMiddleware';
import { mainReducer } from './mainSlice';
import { nodeListener } from './nodeListener';

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

// start node process and add listener
// so it'll dispatch any events it receives
nodeListener(store.dispatch);
