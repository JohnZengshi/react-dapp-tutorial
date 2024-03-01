/*
 * @LastEditors: John
 * @Date: 2024-02-23 18:47:07
 * @LastEditTime: 2024-03-01 09:57:18
 * @Author: John
 */
import Web3, { utils } from "web3";
import Contract from "web3-eth-contract";
import { abi as test_roos_abi } from "@/contract/ROOS_test.json";
import { abi as roos_abi } from "@/contract/ROOS.json";
import { abi as test_usdt_abi } from "@/contract/USDT_test.json";
import usdt_abi from "@/contract/USDT.json";
import erc20Abi from "@/contract/erc20abi.json";
import { ETHEREUM_RPC, Ethereum } from "@/constant/wallet";
import { API_CONTRACT_ADDRESS } from "./api";
import CustomToast from "@/components/common/CustomToast";
import { isMobile } from ".";
import { WalletType } from "@/store/reducer";

export async function subimtByContract(
  buyAmount: bigint, // 支付金额
  buyCount: number, // 认购数量
  randomNumber: number, // 随机数
  rebateRatio: number, // 返佣比例,
  pAddress: string, // 上级地址
  ethereum?: Ethereum,
  fromAddress?: string,
  walletType?: WalletType
) {
  console.log("pay buy contract params", { buyAmount, buyCount, fromAddress });
  const contractAddress = await API_CONTRACT_ADDRESS();
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

  // 授权U
  const authorizedU = (uNum: bigint) => {
    console.log("授权金额参数：", contractAddress, uNum);
    return new Promise<void>((reslove, reject) => {
      usdtContract.methods
        .approve(contractAddress, uNum)
        .send({ from: fromAddress })
        .then((approveRes) => {
          console.log("approve ok:", approveRes);
          reslove();
        })
        .catch((err: any) => {
          console.log("approve error", isMobile ? err.error : err);
          reject(isMobile ? err.error : err);
          // handleCatch(isMobile ? err.error : err, reslove, reject);
        });
    });
  };

  // 获取已经授权的U
  const getApproveUsdt = async (): Promise<bigint | undefined> => {
    return new Promise((resolve, reject) => {
      const tokenContract = new Contract(
        erc20Abi as any,
        networkUsdtAddress,
        web3
      );
      tokenContract.methods
        .allowance(fromAddress, contractAddress)
        .call()
        .then((res: any) => {
          // resolve(res / Math.pow(10, 18));
          resolve(res);
        })
        .catch((err: any) => {
          console.log("get approve usdt err", err);
          // handleCatch(isMobile ? err.error : err, resolve, reject);
          reject(isMobile ? err.error : err);
        });
    });
  };

  return new Promise<string>(async (reslove, reject) => {
    Promise.all([web3.eth.getGasPrice()]).then(async (gasData: any) => {
      console.log("get gas price:", gasData);
      let gasPrice = parseInt(gasData[0]);

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

        contract.methods
          .buyNFTNew(buyCount, buyAmount, randomNumber, rebateRatio, pAddress)
          .estimateGas({ from: fromAddress })
          .then((gas: bigint) => {
            console.log("buyNFTNew estimateGas:", gas);

            contract.methods
              .buyNFTNew(
                buyCount,
                buyAmount,
                randomNumber,
                rebateRatio,
                pAddress
              )
              .send({
                from: fromAddress,
                gas: (gas * 10n).toString(),
                gasPrice: (gas * 10n).toString(),

                // gas: gasPrice.toString(),
                // gasPrice: gasPrice.toString(),

                // gas: parseInt(Number(gas) * 1.2 + ""),
                // gasPrice: parseInt(gasPrice * 1.2 + ""),
              })
              .on("transactionHash", function (hash) {
                console.log("Transaction Hash:", hash);
                // if (walletType === "OKX") {
                //   reslove(hash);
                // }

                // 这里可以对交易哈希进行处理，比如显示在页面上
              })
              .then(function (receipt) {
                // other parts of code to use receipt
                console.log("buyNFTNew send:", receipt);
                // if (walletType === "MetaMask") {
                reslove(receipt.transactionHash);
                // }
              })
              .catch((err: any) => {
                console.log("buyNFTNew Transaction err", err);
                handleCatch(isMobile ? err.error : err, reslove, reject);
                // reject(isMobile ? err.error : err);
              });
          })
          .catch((err: any) => {
            console.log("buyNFTNew estimateGas err", err);
            handleCatch(isMobile ? err.error : err, reslove, reject);
            // reject(isMobile ? err.error : err);
          });
      } catch (err: any) {
        // reject(err);
        handleCatch(isMobile ? err.error : err, reslove, reject);
      }
    });
  });
}

function handleCatch(
  error: {
    code: 100 | 4001 | 432;
    message: string;
    innerError: {
      code: 4001;
      message: string;
      stack: string;
    };
  },
  reslove: (reason?: any) => void,
  reject: (reason?: any) => void
) {
  console.log("contract rpc inner error:", error.innerError);
  console.warn("contract rpc error code:", error.code);
  let errMsg = error.message.replace("execution reverted: ERC20:", "");
  CustomToast(errMsg);

  if (error.code == 432) {
    return;
  }
  // if (error.code == 100 || error.code == 4001) {
  //   reject(error);
  //   return;
  // }
  reject(error); // 遇到错误，取消支付行为
  // reslove();
}
