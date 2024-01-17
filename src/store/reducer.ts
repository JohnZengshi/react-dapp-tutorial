/*
 * @LastEditors: John
 * @Date: 2024-01-11 21:24:31
 * @LastEditTime: 2024-01-17 11:11:19
 * @Author: John
 */
import { ConnectWallet_handleType } from "@/components/common/ConnectWallet";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type WalletType = "OKX" | "UNISAT" | "";
export interface UserState {
  wallet: {
    address: string | undefined;
    connecting: boolean;
    invitationCode: string;
    connected: boolean;
    walletInstall: boolean;
    walletType: WalletType;
    notificationTriggerEvent: "CONNECT" | "TRANSACTION" | "SELECT_WALLET" | "";
    walletRef: ConnectWallet_handleType | null;
    payInfo: {
      cost: number;
      toAddress: string;
      hash: string;
      orderNumber: number;
    } | null;
    thirdInviteCode: string;
  };
  logInStatus: "LOGIN" | "LOG_OUT";
}

const initialState: UserState = {
  wallet: {
    address: "",
    connecting: false,
    invitationCode: "",
    connected: false,
    walletInstall: false,
    walletType: "",
    notificationTriggerEvent: "",
    walletRef: null,
    payInfo: {
      cost: 0,
      toAddress: "",
      hash: "",
      orderNumber: 0,
    },
    thirdInviteCode: "",
  },
  logInStatus: "LOG_OUT",
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    SET_ADDRESS: (state, action: PayloadAction<string | undefined>) => {
      state.wallet.address = action.payload;
    },
    SET_WALLET_CONNECTING: (state, action: PayloadAction<boolean>) => {
      state.wallet.connecting = action.payload;
    },
    SET_USER_INVITATION_CODE: (state, action: PayloadAction<string>) => {
      state.wallet.invitationCode = action.payload;
    },
    SET_CONNECTED: (state, action: PayloadAction<boolean>) => {
      state.wallet.connected = action.payload;
    },
    SET_WALLET_INSTALL: (state, action: PayloadAction<boolean>) => {
      state.wallet.walletInstall = action.payload;
    },
    SET_WALLET_TYPE: (
      state,
      action: PayloadAction<UserState["wallet"]["walletType"]>
    ) => {
      state.wallet.walletType = action.payload;
    },
    SET_NOTIFICATION_TRIGGER_EVENT: (
      state,
      action: PayloadAction<UserState["wallet"]["notificationTriggerEvent"]>
    ) => {
      state.wallet.notificationTriggerEvent = action.payload;
    },
    SET_WALLET_REF: (
      state,
      action: PayloadAction<UserState["wallet"]["walletRef"]>
    ) => {
      state.wallet.walletRef = action.payload;
    },
    SET_PAY_INFO: (
      state,
      action: PayloadAction<UserState["wallet"]["payInfo"]>
    ) => {
      state.wallet.payInfo = action.payload;
    },

    SET_THIRD_INVITE_CODE: (state, action: PayloadAction<string>) => {
      state.wallet.thirdInviteCode = action.payload;
    },
    SET_LOGINSTATUS: (
      state,
      action: PayloadAction<UserState["logInStatus"]>
    ) => {
      state.logInStatus = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  SET_ADDRESS,
  SET_WALLET_CONNECTING,
  SET_USER_INVITATION_CODE,
  SET_CONNECTED,
  SET_WALLET_INSTALL,
  SET_WALLET_TYPE,
  SET_NOTIFICATION_TRIGGER_EVENT,
  SET_WALLET_REF,
  SET_PAY_INFO,
  SET_THIRD_INVITE_CODE,
  SET_LOGINSTATUS,
} = userSlice.actions;

export default userSlice.reducer;
