/*
 * @LastEditors: John
 * @Date: 2024-01-11 21:24:31
 * @LastEditTime: 2024-01-15 12:59:39
 * @Author: John
 */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface SysState {
  isSmallScreen: boolean;
}

const initialState: SysState = {
  isSmallScreen: false,
};

export const sysSlice = createSlice({
  name: "CustomCom",
  initialState: initialState,
  reducers: {
    SET_IS_SMALL_SCREEN: (state, action: PayloadAction<boolean>) => {
      state.isSmallScreen = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { SET_IS_SMALL_SCREEN } = sysSlice.actions;

export default sysSlice.reducer;
