import { configureStore } from '@reduxjs/toolkit';
import bookReducer from '../features/bookSlice/slice';
import chatReducer from '../entities/chat/store/chatSlice'

export const store = configureStore({
  reducer: {
    books: bookReducer,
    chat: chatReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;