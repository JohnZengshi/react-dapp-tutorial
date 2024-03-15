/*
 *                   ___====-_  _-====___
 *             _--^^^#####//      \\#####^^^--_
 *          _-^##########// (    ) \\##########^-_
 *         -############//  |\^^/|  \\############-
 *       _/############//   (@::@)   \############\_
 *      /#############((     \\//     ))#############\
 *     -###############\\    (oo)    //###############-
 *    -#################\\  / VV \  //#################-
 *   -###################\\/      \//###################-
 *  _#/|##########/\######(   /\   )######/\##########|\#_
 *  |/ |#/\#/\#/\/  \#/\##\  |  |  /##/\#/  \/\#/\#/\#| \|
 *  `  |/  V  V  `   V  \#\| |  | |/#/  V   '  V  V  \|  '
 *     `   `  `      `   / | |  | | \   '      '  '   '
 *                      (  | |  | |  )
 *                     __\ | |  | | /__
 *                    (vvv(VVV)(VVV)vvv)
 *
 *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *                神兽保佑            永无BUG
 */

/*
 * @LastEditors: John
 * @Date: 2024-02-23 18:47:07
 * @LastEditTime: 2024-03-12 10:14:54
 * @Author: John
 */
import Web3 from "web3";
import Contract from "web3-eth-contract";
import { abi as test_roos_abi } from "@/contract/ROOS_test.json";
import { abi as roos_abi } from "@/contract/ROOS.json";
import { abi as test_usdt_abi } from "@/contract/USDT_test.json";
import usdt_abi from "@/contract/USDT.json";
import erc20Abi from "@/contract/erc20abi.json";
import { API_CONTRACT_ADDRESS } from "./api";
import CustomToast from "@/components/common/CustomToast";
import {
  writeContract,
  readContract,
  estimateGas,
  watchContractEvent,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { config } from "@/components/WalletProvider";
import { estimateContractGas } from "viem/actions";
import {
  encodeFunctionData,
  formatEther,
  parseEther,
  parseGwei,
} from "viem/utils";
import { TYPE_ADDRESS } from "@/types";

/**
 * @description: 调用合约购买盒子
 * @param {bigint} buyAmount
 * @param {number} buyCount
 * @param {number} randomNumber
 * @param {number} rebateRatio
 * @param {string} pAddress
 * @param {any} ethereum
 * @param {TYPE_ADDRESS | ""} fromAddress
 * @return {*}
 */
export async function subimtByContract(
  buyAmount: bigint, // 支付金额
  buyCount: number, // 认购数量
  randomNumber: number, // 随机数
  rebateRatio: number, // 返佣比例,
  pAddress: string, // 上级地址
  ethereum?: any,
  fromAddress?: TYPE_ADDRESS | ""
) {
  console.log("pay buy contract params", { buyAmount, buyCount, fromAddress });
  await API_CONTRACT_ADDRESS(); // TODO 后台获取地址
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const networkUsdtAddress = import.meta.env.VITE_NETWORK_USDT_ADDRESS;
  console.log("NETWORK_USDT:", networkUsdtAddress);
  const web3 = new Web3(ethereum);

  let roosAbi: any;
  let usdtAbi: any;

  if (import.meta.env.MODE == "development" || import.meta.env.MODE == "test") {
    roosAbi = test_roos_abi;
    usdtAbi = test_usdt_abi;
  } else {
    roosAbi = roos_abi;
    usdtAbi = usdt_abi;
  }
  const contract = new Contract(roosAbi, contractAddress, web3);
  const usdtContract = new Contract(usdtAbi, networkUsdtAddress, web3);
  console.log("contract:", contract);
  console.log("usdt contract:", usdtContract);

  /**
   * @description: 授权U
   * @param {bigint} uNum
   * @return {*}
   */
  const authorizedU = (uNum: bigint) => {
    console.log("授权金额参数：", contractAddress, uNum);
    return new Promise<void>((reslove, reject) => {
      // usdtContract.methods
      //   .approve(contractAddress, uNum)
      //   .send({ from: fromAddress })
      //   .then((approveRes) => {
      //     console.log("approve ok:", approveRes);
      //     reslove();
      //   })
      //   .catch((err: any) => {
      //     console.log("approve error", isMobile ? err.error : err);
      //     reject(isMobile ? err.error : err);
      //     // handleCatch(isMobile ? err.error : err, reslove, reject);
      //   });

      writeContract(config, {
        abi: usdtAbi,
        address: networkUsdtAddress,
        functionName: "approve",
        args: [contractAddress, uNum],
      })
        .then(async (hash) => {
          console.log("approve res", hash);
          const transactionReceipt = await waitForTransactionReceipt(config, {
            hash,
          });
          if (transactionReceipt.status == "success") reslove();
        })
        .catch((err) => {
          console.log("approve error", err);
          reject(err);
        });
    });
  };

  /**
   * @description : 获取已经授权的U
   * @return {*}
   */
  const getApproveUsdt = async (): Promise<bigint | undefined> => {
    return new Promise((reslove, reject) => {
      // const tokenContract = new Contract(
      //   erc20Abi as any,
      //   networkUsdtAddress,
      //   web3
      // );
      // tokenContract.methods
      //   .allowance(fromAddress, contractAddress)
      //   .call()
      //   .then((res: any) => {
      //     // resolve(res / Math.pow(10, 18));
      //     reslove(res);
      //   })
      //   .catch((err: any) => {
      //     console.log("get approve usdt err", err);
      //     reject(err);
      //   });

      readContract(config, {
        abi: erc20Abi,
        address: networkUsdtAddress,
        functionName: "allowance",
        args: [fromAddress, contractAddress],
      })
        .then((res: any) => reslove(res))
        .catch((err) => {
          console.log("get approve usdt err", err);
          reject(err);
        });
    });
  };

  return new Promise<string>(async (reslove, reject) => {
    try {
      let approvedU = await getApproveUsdt();

      console.log("当前要授权的U:", buyAmount, "上次授权的U:", approvedU);

      if (typeof approvedU == "undefined") {
        // 获取授权U失败
        CustomToast("get approve usdt error!");
        return;
      }

      if (approvedU < buyAmount) {
        // const diffU = buyAmount - approvedU;
        await authorizedU(buyAmount);
      }

      console.log(
        "参数:",
        buyCount,
        buyAmount,
        randomNumber,
        rebateRatio,
        pAddress
      );

      // contract.methods
      //   .buyNFTNew(buyCount, buyAmount, randomNumber, rebateRatio, pAddress)
      //   .estimateGas({ from: fromAddress })
      //   .then((gas: bigint) => {
      //     console.log("buyNFTNew estimateGas:", gas);

      //     contract.methods
      //       .buyNFTNew(buyCount, buyAmount, randomNumber, rebateRatio, pAddress)
      //       .send({
      //         from: fromAddress,
      //         gas: (gas * 10n).toString(),
      //         gasPrice: (gas * 10n).toString(),
      //       })
      //       .on("transactionHash", function (hash) {
      //         console.log("Transaction Hash:", hash);
      //         // if (walletType === "OKX") {
      //         //   reslove(hash);
      //         // }

      //         // 这里可以对交易哈希进行处理，比如显示在页面上
      //       })
      //       .then(function (receipt) {
      //         // other parts of code to use receipt
      //         console.log("buyNFTNew send:", receipt);
      //         // if (walletType === "MetaMask") {
      //         reslove(receipt.transactionHash);
      //         // }
      //       })
      //       .catch((err: any) => {
      //         console.log("buyNFTNew Transaction err", err);
      //         handleCatch(err, reslove);
      //         // reject(err);
      //       });
      //   })
      //   .catch((err: any) => {
      //     console.log("buyNFTNew estimateGas err", err);
      //     handleCatch(err, reslove);
      //     // reject(err);
      //   });

      // TODO 预估gas费报错
      estimateGas(config, {
        to: contractAddress,
        data: encodeFunctionData({
          abi: roosAbi,
          functionName: "buyNFTNew",
          args: [buyCount, buyAmount, randomNumber, rebateRatio, pAddress],
        }),
      })
        .then((gas) => {
          console.log("estimate gas:", gas);
          writeContract(config, {
            abi: roosAbi,
            address: contractAddress,
            functionName: "buyNFTNew",
            args: [buyCount, buyAmount, randomNumber, rebateRatio, pAddress],
          })
            .then((receipt) => {
              console.log("write contract success!, receipt:", receipt);
              reslove(receipt);
            })
            .catch((err) => {
              console.log("buyNFTNew Transaction err", err);
              handleCatch(err, reject);
            });
        })
        .catch((err) => {
          console.log("buyNFTNew estimateGas err", err);
          handleCatch(err, reject);
        });
    } catch (err: any) {
      handleCatch(err, reject);
    }
  });
}

/**
 * @description: 统一处理错误
 * @param {*} error
 * @param {function} reslove
 * @param {function} reject
 * @return {*}
 */
function handleCatch(
  error: {
    code?: 100 | 4001 | 432;
    message?: string;
    innerError?: {
      code: 4001;
      message: string;
      stack: string;
    };
  } & {
    cause?: {
      cause: {
        code: number;
        message: string;
      };
    };
  },
  reject?: (reason?: any) => void
) {
  console.log(
    "contract rpc inner error:",
    error.innerError || error.cause?.cause
  );
  console.warn(
    "contract rpc error code:",
    error.code || error.cause?.cause.code
  );
  const commonErr = error.innerError || error.cause?.cause;
  let errMsg = "";

  if (commonErr?.message) {
    errMsg = commonErr.message.replace("execution reverted: ERC20:", "");
  }
  CustomToast(errMsg);

  if (commonErr?.code == 432) {
    return;
  }
  reject?.(commonErr); // 遇到错误，取消支付行为
  // reslove();
}
