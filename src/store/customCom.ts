/*
 * @LastEditors: John
 * @Date: 2024-01-11 21:24:31
 * @LastEditTime: 2024-02-24 12:57:09
 * @Author: John
 */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface CustomComState {
  dialog: {
    open: boolean;
    content: string;
    cannotClose?: boolean;
    showConfirmBtn?: boolean;
    confirmBtnCallBack?: () => void;
    confirmBtnText?: string;
    loading?: boolean;
    hash?: string;
  };
}

const initialState: CustomComState = {
  dialog: {
    open: false,
    content: "",
  },
};

export const customComSlice = createSlice({
  name: "CustomCom",
  initialState: initialState,
  reducers: {
    CUSTOM_DIALOG: (
      state,
      action: PayloadAction<
        Pick<
          CustomComState["dialog"],
          | "content"
          | "cannotClose"
          | "showConfirmBtn"
          | "loading"
          | "hash"
          | "confirmBtnCallBack"
          | "confirmBtnText"
        >
      >
    ) => {
      state.dialog.open = true;
      state.dialog.content = action.payload.content;
      state.dialog.cannotClose = action.payload.cannotClose;
      state.dialog.showConfirmBtn = action.payload.showConfirmBtn;
      state.dialog.loading = action.payload.loading;
      state.dialog.hash = action.payload.hash;
      state.dialog.confirmBtnCallBack = action.payload.confirmBtnCallBack;
      state.dialog.confirmBtnText = action.payload.confirmBtnText;
    },
    SET_CUSTOM_DIALOG_OPEN: (state, action: PayloadAction<boolean>) => {
      state.dialog.open = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { CUSTOM_DIALOG, SET_CUSTOM_DIALOG_OPEN } = customComSlice.actions;

export default customComSlice.reducer;
