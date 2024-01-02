/*
 * @LastEditors: John
 * @Date: 2023-12-29 10:31:13
 * @LastEditTime: 2023-12-29 11:45:01
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
