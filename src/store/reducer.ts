/*
 * @LastEditors: John
 * @Date: 2024-01-11 19:14:33
 * @LastEditTime: 2024-01-11 19:25:50
 * @Author: John
 */
import React, { useReducer } from "react";

// reducer 函数接收当前状态和一个 action，并返回新的状态
type State = { connecting: boolean };
export const connectingReducer = (
  state: State,
  action: { type: "SET_CONNECTING_FALSE" | "SET_CONNECTING_TRUE" }
): State => {
  switch (action.type) {
    case "SET_CONNECTING_FALSE":
      return { connecting: false };
    case "SET_CONNECTING_TRUE":
      return { connecting: true };
    default:
      return state;
  }
};
