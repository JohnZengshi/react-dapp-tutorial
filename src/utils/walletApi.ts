/*
 * @LastEditors: John
 * @Date: 2024-02-23 18:47:07
 * @LastEditTime: 2024-02-23 18:50:43
 * @Author: John
 */
import Web3 from "web3";
import Contract from "web3-eth-contract";
import { abi } from "@/contract/ROOS.json";
import { abi as usdt_abi } from "@/contract/USDT.json";
import { Ethereum } from "@/constant/wallet";

export function subimtByContract(
  cost: number,
  toAddress: string,
  ethereum?: Ethereum,
  fromAddress?: string
) {
  const contractAddress = "0x0dAA2Df16Ad6DB497bD0370a36B4977e59bafa34";
  const tokenAddress = "0xd8dc354620e102295C851a2Bb37a5a88b061f735";
  const web3 = new Web3(
    // "https://arbitrum-sepolia.blockpi.network/v1/rpc/public"
    ethereum
  );
  const contract = new Contract(abi, contractAddress, web3);
  const usdtContract = new Contract(usdt_abi, tokenAddress, web3);
  console.log(contract);

  return new Promise<string>(async (reslove, reject) => {
    // const cost = 1000000;
    Promise.all([web3.eth.getGasPrice()]).then(async (gasData: any) => {
      try {
        console.log("get gas price:", gasData);
        let gasPrice = parseInt(gasData[0]);
        usdtContract.methods
          .approve(contractAddress, cost)
          .send({ from: fromAddress })
          .then((res: any) => {
            console.log("approve function:", res);
            contract.methods
              .ERC20SwapERC721(1, cost)
              .estimateGas({ from: fromAddress })
              .then((res) => {
                console.log("ERC20SwapERC721 estimateGas:", res);
                contract.methods
                  .ERC20SwapERC721(1, cost)
                  .send({
                    from: fromAddress,
                    gas: parseInt(gasPrice * 1.2 + "") + "",
                    gasPrice: parseInt(gasPrice * 1.2 + "") + "",
                  })
                  .then(function (receipt) {
                    // other parts of code to use receipt
                    console.log("ERC20SwapERC721 send:", receipt);
                    reslove(receipt.transactionHash);
                  });
              });
          });
      } catch (error) {
        console.log(error);
      }
    });
  });
}
