/*
 * @LastEditors: John
 * @Date: 2024-02-23 18:47:07
 * @LastEditTime: 2024-02-25 16:17:24
 * @Author: John
 */
import Web3 from "web3";
import Contract from "web3-eth-contract";
import { abi } from "@/contract/ROOS.json";
import { abi as usdt_abi } from "@/contract/USDT.json";
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
  pAddress: number,
  ethereum?: Ethereum,
  fromAddress?: string
) {
  console.log("pay buy contract params", { buyAmount, buyCount, fromAddress });
  // const contractAddress = "0x0dAA2Df16Ad6DB497bD0370a36B4977e59bafa34";
  const contractAddress = await API_CONTRACT_ADDRESS();
  const tokenAddress = "0xd8dc354620e102295C851a2Bb37a5a88b061f735";
  const web3 = new Web3(
    // "https://arbitrum-sepolia.blockpi.network/v1/rpc/public"
    ethereum
  );
  const contract = new Contract(abi, contractAddress, web3);
  const usdtContract = new Contract(usdt_abi, tokenAddress, web3);
  console.log(contract);

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
  const getApproveUsdt = async (): Promise<bigint> => {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      const tokenContract = new Contract(erc20Abi, tokenAddress, web3);
      tokenContract.methods
        .allowance(fromAddress, contractAddress)
        .call()
        .then((res: any) => {
          // resolve(res / Math.pow(10, 18));
          console.log("reslove:", res);
          resolve(res);
        })
        .catch((err: any) => {
          console.log("err", err);
          handleCatch(isMobile ? err.error : err, resolve, reject);
        });
    });
  };

  return new Promise<string>(async (reslove, reject) => {
    // const cost = 1000000;
    Promise.all([web3.eth.getGasPrice()]).then(async (gasData: any) => {
      console.log("get gas price:", gasData);
      let gasPrice = parseInt(gasData[0]);

      let approvedU = await getApproveUsdt();

      console.log("当前要授权的U:", buyAmount, "上次授权的U:", approvedU);

      if (approvedU < buyAmount) {
        // const diffU = buyAmount - approvedU;
        await authorizedU(buyAmount);
      }

      contract.methods
        .ERC20SwapERC721(
          buyCount,
          buyAmount,
          randomNumber,
          rebateRatio,
          pAddress
        )
        .estimateGas({ from: fromAddress })
        .then((ERC20SwapERC721Res) => {
          console.log("ERC20SwapERC721 estimateGas:", ERC20SwapERC721Res);
          contract.methods
            .ERC20SwapERC721(
              buyCount,
              buyAmount,
              randomNumber,
              rebateRatio,
              pAddress
            )
            .send({
              from: fromAddress,
              gas: parseInt(gasPrice * 1.2 + "") + "",
              gasPrice: parseInt(gasPrice * 1.2 + "") + "",
            })
            .then(function (receipt) {
              // other parts of code to use receipt
              console.log("ERC20SwapERC721 send:", receipt);
              reslove(receipt.transactionHash);
            })
            .catch((err) => {
              console.log("ERC20SwapERC721 error", isMobile ? err.error : err);
              handleCatch(isMobile ? err.error : err, reslove, reject);
            });
        })
        .catch((err) => {
          console.log("ERC20SwapERC721 error", isMobile ? err.error : err);
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
  console.log(error.code);
  CustomToast(error.message);
  if (error.code == 100) {
    reject(error);
    return;
  }
  reslove();
}
