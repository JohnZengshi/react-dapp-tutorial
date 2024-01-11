/*
 * @LastEditors: John
 * @Date: 2024-01-11 21:24:31
 * @LastEditTime: 2024-01-11 22:45:06
 * @Author: John
 */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface UserState {
  wallet: {
    address: string;
    connecting: boolean;
    invitationCode: string;
  };
}

const initialState: UserState = {
  wallet: { address: "", connecting: false, invitationCode: "" },
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    SET_ADDRESS: (state, action: PayloadAction<string>) => {
      state.wallet.address = action.payload;
    },
    SET_WALLET_CONNECTING: (state, action: PayloadAction<boolean>) => {
      state.wallet.connecting = action.payload;
    },
    SET_USER_INVITATION_CODE: (state, action: PayloadAction<string>) => {
      state.wallet.invitationCode = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { SET_ADDRESS, SET_WALLET_CONNECTING, SET_USER_INVITATION_CODE } =
  userSlice.actions;

export default userSlice.reducer;
