/*
 * @LastEditors: John
 * @Date: 2024-01-11 22:05:44
 * @LastEditTime: 2024-01-11 22:05:56
 * @Author: John
 */
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
