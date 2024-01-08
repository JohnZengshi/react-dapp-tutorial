/*
 * @LastEditors: John
 * @Date: 2023-12-29 10:31:13
 * @LastEditTime: 2024-01-08 16:49:27
 * @Author: John
 */
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
