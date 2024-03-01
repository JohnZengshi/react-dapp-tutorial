/*
 * @LastEditors: John
 * @Date: 2023-12-29 10:31:13
 * @LastEditTime: 2024-02-29 17:15:19
 * @Author: John
 */
import CustomToast from "@/components/common/CustomToast";
import { Buffer } from "buffer";
import { SIGNUP_CHAIN_TYPE } from "./api";
import { ChainType } from "@/store/reducer";

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
  roos_token = "roos_token",
}

export enum sessionStorageKey {
  okx_address = "okx_address",
  unisat_address = "unisat_address",
  metaMask_address = "metaMask_address",
  roos_token = "roos_token",
}

export enum UrlQueryParamsKey {
  INVITE_CODE = "inviteCode",
}
interface RequestOptions {
  method: "GET" | "POST";
  headers?: HeadersInit;
  body?: BodyInit | null;
}
export const BaseUrl = import.meta.env.VITE_BASE_API_URL;
export async function fetchUrl<D = any, P = any>(
  url: string,
  options: RequestOptions,
  // address: string,
  // token: string,
  params?: P
) {
  options.headers = {
    Authorization:
      // token,
      sessionStorage.getItem(sessionStorageKey.roos_token)?.split("::::")[1] ||
      "",
    "Accept-Language": "zh-CN",
    address:
      sessionStorage.getItem(sessionStorageKey.okx_address) ||
      sessionStorage.getItem(sessionStorageKey.metaMask_address) ||
      "",
    // address,
    "Content-Type": "application/json",
  };
  if (params) options.body = JSON.stringify(params);
  try {
    const response = await fetch(`${BaseUrl}${url}`, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: {
      code: 0;
      data: D;
      msg: string;
      timeMillis: number;
    } = await response.json();

    if (data.code === 0) return data;
    CustomToast(data.msg);
    throw new Error(`error!: ${data.msg}`);
  } catch (error) {
    console.error("Error during fetch:", error);
    CustomToast("Server Error!");
    throw error;
  }
}

export enum Wallet {
  OKX = "OKX",
  UniSat = "UNI_SAT",
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

export function fillArray(inputArray: string[], length: number) {
  const outputArray = Array(length).fill("");
  for (let i = 0; i < Math.min(inputArray.length, length); i++) {
    outputArray[i] = inputArray[i];
  }
  return outputArray;
}

export function getChainCode(type: ChainType) {
  let chainType: SIGNUP_CHAIN_TYPE;
  switch (type) {
    case "BTC":
      chainType = 1;
      break;
    case "ETHEREUM":
      chainType = 2;
      break;
    case "POLYGON":
      chainType = 3;
      break;
    case "BNB_CHAIN":
      chainType = 4;
      break;
    case "Arbitrum One":
      chainType = 5;
      break;
    case "Arbitrum test":
      chainType = 6;
      break;
    default:
      chainType = 2;
      break;
  }

  return chainType;
}

export function copyText(text: string) {
  // try {
  //   navigator.clipboard
  //     .writeText(text)
  //     .then(() => {
  //       CustomToast("Copy Success");
  //     })
  //     .catch(() => {
  //       CustomToast("Copy Fail");
  //     });
  // } catch (error) {
  //   CustomToast("Failed to copy");
  // }

  // value 为需要复制的内容
  const value = text;
  // 1、创建DOM input框
  const input = document.createElement("input");
  // 2、隐藏input
  // @ts-ignore
  input.style = { opacity: 0, height: 0, lineHeight: 0, fontSize: 0 };

  // 3、将指定文本赋值给input
  input.value = value;
  // 4、将input插入文档
  document.body.appendChild(input);
  // 5、选中文本
  // @ts-ignore
  input.select();
  // 6、复制到剪切板
  const isCopySuccess = document.execCommand("copy");

  // 7、复制成功后提示
  isCopySuccess && CustomToast("Copy Success");
  // 8、 销魂DOM
  document.body.removeChild(input);
}
