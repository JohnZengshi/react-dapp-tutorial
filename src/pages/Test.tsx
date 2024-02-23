/*
 * @LastEditors: John
 * @Date: 2024-02-22 15:12:57
 * @LastEditTime: 2024-02-23 10:56:10
 * @Author: John
 */
// import { useReadContract } from "wagmi";
import { abi } from "@/contract/ROOS.json";
import { useEffect } from "react";
import { Contract } from "web3-eth-contract";
import Web3 from "web3";
import { ethers } from "ethers";
import { UInt8 } from "@okxweb3/coin-bitcoin/dist/bitcoinjs-lib/types";
import { Transaction, signTransaction } from "web3-eth-accounts";

const USDTAddress = "0x54BdCcFb56f40F80022A5F47b2c3088d3940C5Dc";
const piggybankBytecode =
  "0x608060405234801561001057600080fd5b5033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000808190555061023b806100686000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632e1a7d4d1461005c5780638da5cb5b1461009d578063d0e30db0146100f4575b600080fd5b34801561006857600080fd5b5061008760048036038101908080359060200190929190505050610112565b6040518082815260200191505060405180910390f35b3480156100a957600080fd5b506100b26101d0565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100fc6101f6565b6040518082815260200191505060405180910390f35b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561017057600080fd5b8160008082825403925050819055503373ffffffffffffffffffffffffffffffffffffffff166108fc839081150290604051600060405180830381858888f193505050501580156101c5573d6000803e3d6000fd5b506000549050919050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60003460008082825401925050819055506000549050905600a165627a7a72305820f237db3ec816a52589d82512117bc85bc08d3537683ffeff9059108caf3e5d400029";
export default function () {
  // const { data, isError, isLoading } = useReadContract({
  //   address: USDTAddress,
  //   abi: abi,
  //   functionName: "ERC20SwapERC721",
  // });

  // useEffect(() => {
  //   let ethersProvider = new ethers.providers.Web3Provider(provider, 'any');
  //   let piggybankFactory = new ethers.ContractFactory(
  //     abi,
  //     piggybankBytecode,
  //     ethersProvider.getSigner()
  //   );
  //   let piggybankContract = await piggybankFactory.deploy();
  //   return () => {};
  // }, []);

  // useEffect(() => {
  //   let web3 = new Web3(
  //     new Web3.providers.HttpProvider(
  //       "https://go.getblock.io/f3cd4006e60348f7bb646928a1838010"
  //     )
  //   );

  //   var contractAddress = "0x4E4861f95f4cB129Dae9E739458f1583E1100Dd1";
  //   var myContract = new web3.eth.Contract(abi, contractAddress);

  //   myContract.methods.setPrice().send({
  //     value: "",
  //     from: "0x74298Fb48Ce1901Fe7563FE5494ee242BA07f61c",
  //   }),
  //     function () {};

  //   return () => {};
  // }, []);

  // useEffect(() => {
  //   // const Web3 = require("web3");
  //   async function run() {
  //     const web3 = new Web3(
  //       "https://go.getblock.io/f3cd4006e60348f7bb646928a1838010"
  //     );

  //     const contractAbi = JSON.parse(
  //       '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Sent","type":"event"},{"inputs":[{"internalType":"address","name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"balance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"minter","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"send","outputs":[],"stateMutability":"nonpayable","type":"function"}]'
  //     );
  //     const contractAddress = USDTAddress;
  //     const myContract = new web3.eth.Contract(abi, contractAddress);
  //     console.log("myContract", myContract.methods);
  //     // 调用合约，读取数据
  //     myContract.methods.setPrice(200, 2).send({
  //       from: "0x74298Fb48Ce1901Fe7563FE5494ee242BA07f61c",
  //     });
  //   }

  //   run();

  //   return () => {};
  // }, []);

  // useEffect(() => {
  //   function wellchong() {
  //     var ethers = require("ethers");
  //     const Web3 = require("web3");
  //     const web3 = new Web3(
  //       "https://go.getblock.io/f3cd4006e60348f7bb646928a1838010"
  //     );
  //     let abi = [
  //       "function transfer(address recipient, uint256 amount) external returns (bool)",
  //     ];
  //     let num = web3.utils.toWei("0.01", "ether");
  //     let iface = new ethers.utils.Interface(abi);
  //     let obj = {
  //       value: 0,
  //       to: that.rechData.tokenContract,
  //       data: iface.encodeFunctionData("transfer", [
  //         that.rechData.rechargeAddress,
  //         num,
  //       ]),
  //       from: sessionStorage.address,
  //     };
  //     web3.eth
  //       .sendTransaction(obj)
  //       .then(function (receipt, error) {
  //         that.extract();
  //       })
  //       .catch((err) => {
  //         that.$loading.hide();
  //       });
  //   }

  //   wellchong();

  //   return () => {};
  // }, []);

  useEffect(() => {
    signTransaction(
      new Transaction({
        to: "0x118C2E5F57FD62C2B5b46a5ae9216F4FF4011a07",
        value: "0x186A0",
        gasLimit: "0x520812",
        gasPrice: "0x09184e72a000",
        data: "",
        nonce: 0,
      }),
      "0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318"
    ).then((res) => {
      console.log(res);
    });

    return () => {};
  }, []);

  return <div className="pt-[var(--pc-nav-height)]">test</div>;
}
