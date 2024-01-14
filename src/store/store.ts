/*
 * @LastEditors: John
 * @Date: 2024-01-11 21:25:34
 * @LastEditTime: 2024-01-14 17:49:03
 * @Author: John
 */
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/store/reducer";
import customComReducer from "@/store/customCom";
// ...

const store = configureStore({
  reducer: {
    user: userReducer,
    customCom: customComReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
