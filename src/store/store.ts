/*
 * @LastEditors: John
 * @Date: 2024-01-11 21:25:34
 * @LastEditTime: 2024-02-26 15:45:00
 * @Author: John
 */
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/store/reducer";
import customComReducer from "@/store/customCom";
import sysComReducer from "@/store/sys";
// ...

const store = configureStore({
  reducer: {
    user: userReducer,
    customCom: customComReducer,
    sys: sysComReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
