import {
  useState,
  useEffect,
  useMemo,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { toWei } from "web3-utils";
import { ethRpcMethods } from "web3-rpc-methods";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Contract } from "web3-eth-contract";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { Toaster } from "@/components/ui/toaster";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Buffer } from "buffer";
import { SiweMessage } from "siwe";

// import { useSDK } from "@metamask/sdk-react";
import detectEthereumProvider from "@metamask/detect-provider";
import CustomToast from "@/components/common/CustomToast";
import {
  ETHEREUM_RPC,
  WALLET_ARBITRUM_ONE,
  WALLET_ETHEREUM,
  WALLET_TEST,
} from "@/constant/wallet";
import { useAppSelector } from "@/store/hooks";
import { ChainType } from "@/store/reducer";
import Web3 from "web3";
import { signTransaction, Transaction } from "web3-eth-accounts";
import { subimtByContract } from "@/utils/walletApi";
import { TYPE_ADDRESS } from "@/types";

export type MetaMask_HandleType = {
  _connect: (chainType: ChainType) => Promise<TYPE_ADDRESS>;
  _disConnect?: () => Promise<void>;
  _onSubmit: (
    buyAmount: string,
    buyCount: number,
    randomNumber: number, // 随机数
    rebateRatio: number, // 返佣比例,
    pAddress: string
  ) => Promise<string>;
  _sign: (address: TYPE_ADDRESS, message: string) => Promise<string>;
};

const formSchema = z.object({
  to: z.custom((val: any) => /^0x[0-9,a-f,A-F]{40}$/.test(val)),
  value: z.number().positive(),

  gas: z.number(),
  // data: z.custom((val: any) => /^0x[0-9a-f]*$/.test(val)),
  gasPrice: z.number(),
  maxPriorityFeePerGas: z.number(),
  maxFeePerGas: z.number(),
});

const MetaMask = forwardRef<
  MetaMask_HandleType,
  {
    handleAccountsChanged: (accounts: TYPE_ADDRESS) => void;
    checkInstalledOk: () => Promise<void>;
  }
>((props, ref) => {
  const [open, setOpen] = useState(false);
  const [siweSignStr, setSiweSignStr] = useState<string>("");
  const [siweSignLoading, setSiweSignLoading] = useState<boolean>(false);
  const [sendingTransaction, setSendingTransaction] = useState<boolean>(false);
  const { toast } = useToast();

  const user = useAppSelector((state) => state.user);

  useImperativeHandle(ref, () => {
    return {
      _connect(chainType: ChainType) {
        return connect(chainType);
      },
      // _disConnect() {
      //   // return disConnect(); TODO 补充disConnect
      // },
      _onSubmit(
        buyAmount,
        buyCount,
        randomNumber, // 随机数
        rebateRatio, // 返佣比例,
        pAddress
      ) {
        return onSubmit(
          buyAmount,
          buyCount,
          randomNumber,
          rebateRatio,
          pAddress
        ); //TODO 补充onSubmit✔
      },
      _sign(address, message) {
        return sign(address, message); // TODO 补充sign
      },
    };
  });

  // 接入sdk
  // const { sdk, account, balance, chainId, provider } = useSDK();

  // const formatBalanceValue = useMemo(
  //   () => formatBalance(balance || "0"),
  //   [balance]
  // );

  // 处理连接
  const connect = async (chainType: ChainType) => {
    return new Promise<TYPE_ADDRESS>(async (reslove, reject) => {
      await checkinstall();
      try {
        let res = await ethereum?.request({
          method: ETHEREUM_RPC.EthRequestAccounts,
        });
        if (res) {
          if (chainType == "ETHEREUM") {
            await ethereum?.request({
              method: ETHEREUM_RPC.WalletSwitchEthereumChain,
              params: [{ chainId: WALLET_ETHEREUM.chainId }],
            });
          } else if (chainType == "Arbitrum One") {
            try {
              await ethereum?.request({
                method: ETHEREUM_RPC.WalletSwitchEthereumChain,
                params: [{ chainId: WALLET_ARBITRUM_ONE.chainId }],
              });
            } catch (switchError: any) {
              if (switchError.code === 4902) {
                try {
                  await ethereum?.request({
                    method: ETHEREUM_RPC.WalletAddEthereumChain,
                    params: [WALLET_ARBITRUM_ONE],
                  });
                } catch (addError) {
                  // handle "add" error
                  console.error(addError);
                }
              }
            }
          } else if (chainType == "Arbitrum test") {
            try {
              await ethereum?.request({
                method: ETHEREUM_RPC.WalletSwitchEthereumChain,
                params: [{ chainId: WALLET_TEST.chainId }],
              });
            } catch (switchError: any) {
              if (switchError.code === 4902) {
                try {
                  await ethereum?.request({
                    method: ETHEREUM_RPC.WalletAddEthereumChain,
                    params: [WALLET_TEST],
                  });
                } catch (addError) {
                  // handle "add" error
                  console.error(addError);
                }
              }
            }
          }

          reslove(res[0]);
          console.log("metaMask connect success, address:", res[0]);
        }
      } catch (err: any) {
        console.warn(`failed to connect..`, err);
        // CustomToast(err.err.message);
      }
    });
  };
  // 发送交易
  function onSubmit(
    buyAmount: string,
    buyCount: number,
    randomNumber: number, // 随机数
    rebateRatio: number, // 返佣比例,
    pAddress: string
  ) {
    return subimtByContract(
      BigInt(buyAmount),
      buyCount,
      randomNumber,
      rebateRatio,
      pAddress,
      ethereum,
      user.wallet.address
    );
  }

  // 签名
  const sign = (address: TYPE_ADDRESS, message: string) => {
    return new Promise<string>((reslove, reject) => {
      ethereum
        ?.request({
          method: ETHEREUM_RPC.PERSONAL_SIGN,
          params: [
            `0x${Buffer.from(message, "utf8").toString("hex")}`,
            address,
          ],
        })
        .then((res) => {
          console.log(res);
          reslove(res);
        })
        .catch((err) => handleCatch(err));
    });
  };

  // // 检测是否安装okx
  function checkinstall(): Promise<void> {
    return new Promise(async (reslove, reject) => {
      const provider = await detectEthereumProvider();
      if (provider) {
        // From now on, this should always be true:
        // provider === window.ethereum
        if (provider !== (window.ethereum as any)) {
          console.error("Do you have multiple wallets installed?");
          return;
        }
        console.log("metaMask is installed!");
        reslove();
      } else {
        CustomToast("You haven't installed a wallet yet！");
        console.warn("metaMask is not installed!!");
      }
    });
  }

  const ethereum = window.ethereum;
  useLayoutEffect(() => {
    (async () => {
      await checkinstall();
      await props.checkInstalledOk();
      // 监听账户变化
      console.log("绑定accountChanged事件");
      ethereum?.on("accountsChanged", handleAccountsChanged);
    })();
    return () => {
      // console.log("解绑accountChanged事件");
      // ethereum?.removeListener("accountChanged", handleAccountsChanged);
    };
  }, []);

  // 用户变化
  async function handleAccountsChanged(accounts: Array<TYPE_ADDRESS>) {
    props.handleAccountsChanged(accounts[0]);
  }

  // 统一处理错误
  function handleCatch(e: { code: number; message: string }) {
    // console.log(e.code);
    if (typeof e.message === "string") {
      console.warn(e.message);
      if (/[\u4e00-\u9fa5]/.test(e.message)) return;
      CustomToast(e.message);
    }
  }

  // TODO 监听用户切换链（需要重新登录）

  return <></>;
});

export default MetaMask;
