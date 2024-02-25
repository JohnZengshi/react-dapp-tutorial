/*
 * @LastEditors: John
 * @Date: 2024-02-23 18:47:07
 * @LastEditTime: 2024-02-25 20:04:43
 * @Author: John
 */
import Web3 from "web3";
import Contract from "web3-eth-contract";
import { abi as test_roos_abi } from "@/contract/ROOS_test.json";
import { abi as test_usdt_abi } from "@/contract/USDT_test.json";
import erc20Abi from "@/contract/erc20abi.json";
import { Ethereum } from "@/constant/wallet";
import { API_CONTRACT_ADDRESS } from "./api";
import CustomToast from "@/components/common/CustomToast";
import { isMobile } from ".";

export async function subimtByContract(
  buyAmount: bigint, // 支付金额
  buyCount: number, // 认购数量
  randomNumber: number, // 随机数
  rebateRatio: number, // 返佣比例,
  pAddress: number, // 上级地址
  ethereum?: Ethereum,
  fromAddress?: string
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
    roosAbi = test_roos_abi;
    usdtAbi = test_usdt_abi;
  }
  const contract = new Contract(roosAbi, contractAddress, web3);
  const usdtContract = new Contract(usdtAbi, networkUsdtAddress, web3);
  console.log("contract:", contract);
  console.log("usdt contract:", usdtContract);

  // 授权U
  const authorizedU = (uNum: bigint) => {
    return new Promise<void>((reslove, reject) => {
      usdtContract.methods
        .approve(contractAddress, uNum)
        .send({ from: fromAddress })
        .then((approveRes: any) => {
          console.log("approve function:", approveRes);
          reslove();
        })
        .catch((err: any) => {
          console.log("approve error", isMobile ? err.error : err);
          handleCatch(isMobile ? err.error : err, reslove, reject);
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
          console.log("err", err);
          handleCatch(isMobile ? err.error : err, resolve, reject);
        });
    });
  };

  return new Promise<string>(async (reslove, reject) => {
    Promise.all([web3.eth.getGasPrice()]).then(async (gasData: any) => {
      console.log("get gas price:", gasData);
      let gasPrice = parseInt(gasData[0]);

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

      contract.methods
        .buyNFTNew(buyCount, buyAmount, randomNumber, rebateRatio, pAddress)
        .estimateGas({ from: fromAddress })
        .then((ERC20SwapERC721Res) => {
          console.log("buyNFTNew estimateGas:", ERC20SwapERC721Res);
          contract.methods
            .buyNFTNew(buyCount, buyAmount, randomNumber, rebateRatio, pAddress)
            .send({
              from: fromAddress,
              gas: parseInt(gasPrice * 1.2 + "") + "",
              gasPrice: parseInt(gasPrice * 1.2 + "") + "",
            })
            .then(function (receipt) {
              // other parts of code to use receipt
              console.log("buyNFTNew send:", receipt);
              reslove(receipt.transactionHash);
            })
            .catch((err) => {
              console.log("buyNFTNew error", isMobile ? err.error : err);
              handleCatch(isMobile ? err.error : err, reslove, reject);
            });
        })
        .catch((err) => {
          console.log("buyNFTNew error", isMobile ? err.error : err);
          handleCatch(isMobile ? err.error : err, reslove, reject);
        });
    });
  });
}

function handleCatch(
  error: { code: number; message: string },
  reslove: (reason?: any) => void,
  reject: (reason?: any) => void
) {
  console.warn("contract rpc error code:", error.code);
  CustomToast(error.message);
  if (error.code == 100) {
    reject(error);
    return;
  }
  reslove();
}
