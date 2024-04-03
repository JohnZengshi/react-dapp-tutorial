/*
 * @LastEditors: John
 * @Date: 2024-01-11 21:24:31
 * @LastEditTime: 2024-03-31 11:42:58
 * @Author: John
 */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface SysState {
  isSmallScreen: boolean;
  HomeScrollYProgress: number;
}

const initialState: SysState = {
  isSmallScreen: false,
  HomeScrollYProgress: 0,
};

export const sysSlice = createSlice({
  name: "CustomCom",
  initialState: initialState,
  reducers: {
    SET_IS_SMALL_SCREEN: (state, action: PayloadAction<boolean>) => {
      state.isSmallScreen = action.payload;
    },
    SET_HOME_SCROLL_Y_PROGRESS: (state, action: PayloadAction<number>) => {
      state.HomeScrollYProgress = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { SET_IS_SMALL_SCREEN, SET_HOME_SCROLL_Y_PROGRESS } =
  sysSlice.actions;

export default sysSlice.reducer;
