/*
 * @LastEditors: John
 * @Date: 2024-01-11 21:24:31
 * @LastEditTime: 2024-03-15 14:33:28
 * @Author: John
 */
import { TYPE_ADDRESS } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type WalletType = "OKX" | "UNISAT" | "MetaMask" | "";
export type ChainType =
  | "BTC"
  | "ETHEREUM"
  | "POLYGON"
  | "BNB_CHAIN"
  | "Arbitrum One"
  | "Arbitrum test"
  | "";
export interface UserState {
  wallet: {
    address: TYPE_ADDRESS | "";
    connecting: boolean;
    invitationCode: string;
    connected: boolean;
    walletInstall: boolean;
    unisatWalletInstalled: boolean;
    // walletType: WalletType;
    notificationTriggerEvent:
      | "CONNECT" // 链接钱包
      | "TRANSACTION" // 交易
      | "SELECT_WALLET" // 选择钱包
      | "SELECT_WALLET_MULTI_CHAIN" // 选择钱包（多种链）
      | "";
    payInfo: {
      buyCount: number; // 认购数量,
      buyAmount: string; // 支付金额
      toAddress: string;
      hash: string;
      orderNumber: number;

      address: string; // 上级地址 (数字)
      num: number; // 随机数
      rebateRatio: number; // 返佣比例
    } | null;
    thirdInviteCode: string;
    // chainType: ChainType;
  };
  logInStatus: "LOGIN" | "LOG_OUT";
  buyLoading: boolean;
}

const initialState: UserState = {
  wallet: {
    address: "",
    connecting: false,
    invitationCode: "",
    connected: false,
    walletInstall: false,
    unisatWalletInstalled: false,
    // walletType: "",
    notificationTriggerEvent: "",
    payInfo: null,
    thirdInviteCode: "",
    // chainType: "",
  },
  logInStatus: "LOG_OUT",
  buyLoading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    SET_ADDRESS: (state, action: PayloadAction<TYPE_ADDRESS | "">) => {
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
    SET_UNISAT_WALLET_INSTALL: (state, action: PayloadAction<boolean>) => {
      state.wallet.unisatWalletInstalled = action.payload;
    },
    // SET_WALLET_TYPE: (
    //   state,
    //   action: PayloadAction<UserState["wallet"]["walletType"]>
    // ) => {
    //   state.wallet.walletType = action.payload;
    // },
    SET_NOTIFICATION_TRIGGER_EVENT: (
      state,
      action: PayloadAction<UserState["wallet"]["notificationTriggerEvent"]>
    ) => {
      state.wallet.notificationTriggerEvent = action.payload;
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

    // SET_CHAIN_TYPE: (
    //   state,
    //   action: PayloadAction<UserState["wallet"]["chainType"]>
    // ) => {
    //   state.wallet.chainType = action.payload;
    // },

    SET_BUY_LOADING: (
      state,
      action: PayloadAction<UserState["buyLoading"]>
    ) => {
      state.buyLoading = action.payload;
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
  SET_UNISAT_WALLET_INSTALL,
  // SET_WALLET_TYPE,
  SET_NOTIFICATION_TRIGGER_EVENT,
  SET_PAY_INFO,
  SET_THIRD_INVITE_CODE,
  SET_LOGINSTATUS,
  // SET_CHAIN_TYPE,
  SET_BUY_LOADING,
} = userSlice.actions;

export default userSlice.reducer;
