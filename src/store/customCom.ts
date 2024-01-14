/*
 * @LastEditors: John
 * @Date: 2024-01-11 21:24:31
 * @LastEditTime: 2024-01-14 18:20:40
 * @Author: John
 */
import { ConnectWallet_handleType } from "@/components/common/ConnectWallet";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface CustomComState {
  dialog: {
    open: boolean;
    content: string;
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
    CUSTOM_DIALOG: (state, action: PayloadAction<{ content: string }>) => {
      state.dialog.open = true;
      state.dialog.content = action.payload.content;
    },
    SET_CUSTOM_DIALOG_OPEN: (state, action: PayloadAction<boolean>) => {
      state.dialog.open = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { CUSTOM_DIALOG, SET_CUSTOM_DIALOG_OPEN } = customComSlice.actions;

export default customComSlice.reducer;
