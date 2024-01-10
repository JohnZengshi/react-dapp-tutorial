/*
 * @LastEditors: John
 * @Date: 2023-12-29 10:31:13
 * @LastEditTime: 2024-01-10 15:56:03
 * @Author: John
 */
import { Buffer } from "buffer";
export const formatBalance = (rawBalance: string) => {
  // console.log("rawBalance:", rawBalance);
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(4);
  return balance;
};

export const formatValue = (rawValue: number) => {
  return (rawValue * 1000000000000000000).toString(16);
};

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex);
  return chainIdNum;
};

export function shortenString(
  inputString: string,
  startLength: number,
  endLength: number
) {
  if (inputString.length <= startLength + endLength) {
    return inputString; // 如果字符串长度小于等于要保留的前后字符数之和，直接返回原字符串
  }

  const startPart = inputString.slice(0, startLength);
  const endPart = inputString.slice(-endLength);

  return `${startPart}...${endPart}`;
}

export const BTC_Unit_Converter = 100000000;

export const ua = navigator.userAgent;
export const isIOS = /iphone|ipad|ipod|ios/i.test(ua);
export const isAndroid = /android|XiaoMi|MiuiBrowser/i.test(ua);
export const isMobile = isIOS || isAndroid;
export const isOKApp = /OKApp/i.test(ua);
export enum localStorageKey {
  okx_address = "okx_address",
}
interface RequestOptions {
  method: "GET" | "POST";
  headers?: HeadersInit;
  body?: BodyInit | null;
}
export const BaseUrl = import.meta.env.VITE_BASE_API_URL;
export async function fetchUrl(url: string, options: RequestOptions) {
  options.headers = {
    Authorization: localStorage.getItem("token") || "",
    "Accept-Language": "zh-CN",
    address: localStorage.getItem(localStorageKey.okx_address) || "",
    "Content-Type": "application/json",
  };
  try {
    const response = await fetch(`${BaseUrl}${url}`, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during fetch:", error);
    throw error;
  }
}

export enum Wallet {
  OKX = "OKX",
  UniSat = "UniSat",
}

// 定义一个函数，用于获取指定参数的值
export function getUrlQueryParam(key: string): string | undefined {
  console.log(window.location);
  const query: Map<string, string> = new Map();
  const queryStr = window.location.href.split("?")[1];
  if (queryStr) {
    const queryStrArr = queryStr.split("&");
    queryStrArr.forEach((v) => {
      const queryArr = v.split("=");
      query.set(queryArr[0], queryArr[1]);
    });
  }
  return query.get(key);
}

export function stringToHex(inputString: string): string {
  const buffer = Buffer.from(inputString, "utf-8");
  return buffer.toString("hex");
}
