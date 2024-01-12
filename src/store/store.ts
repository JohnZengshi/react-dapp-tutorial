/*
 * @LastEditors: John
 * @Date: 2024-01-11 21:25:34
 * @LastEditTime: 2024-01-12 13:44:19
 * @Author: John
 */
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/store/reducer";
// ...

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
