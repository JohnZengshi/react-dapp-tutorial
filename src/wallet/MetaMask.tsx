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
import { abi } from "@/contract/ROOS.json";
export type MetaMask_HandleType = {
  _connect: (chainType: ChainType) => Promise<string>;
  _disConnect?: () => Promise<void>;
  _onSubmit: (cost: number, toAddress: string) => Promise<string>;
  _sign: (address: string, message: string) => Promise<string>;
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
    handleAccountsChanged: (accounts: string) => void;
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
      _onSubmit(cost: number, toAddress: string) {
        return onSubmit(cost, toAddress); //TODO 补充onSubmit✔
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
    return new Promise<string>(async (reslove, reject) => {
      // await checkinstall();
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
            await ethereum?.request({
              method: ETHEREUM_RPC.WalletAddEthereumChain,
              params: [WALLET_ARBITRUM_ONE],
            });
          } else if (chainType == "Arbitrum test") {
            await ethereum?.request({
              method: ETHEREUM_RPC.WalletAddEthereumChain,
              params: [WALLET_TEST],
            });
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
  function onSubmit(cost: number, toAddress: string) {
    const contractAddress = "0x54BdCcFb56f40F80022A5F47b2c3088d3940C5Dc";
    // const web3 = new Web3(
    //   // "https://arbitrum-sepolia.blockpi.network/v1/rpc/public"
    //   ethereum
    // );
    const contract = new Contract(abi);
    console.log(contract);

    return new Promise<string>(async (reslove, reject) => {
      ethereum
        ?.request({
          method: ETHEREUM_RPC.EthSendTransaction,
          params: [
            {
              from: user.wallet.address,
              to: contractAddress,
              gas: "0x47888",
              value: toWei(0.0001, "ether"),
              // @ts-ignore
              data: contract.methods.ERC20SwapERC721(1).encodeABI(),
            },
          ],
        })
        .then((hash) => {
          console.log("eth_sendTransaction success:", hash);
          reslove(hash);
        })
        .catch((err) => {
          handleCatch(err as any);
        });

      //Error because Contract doesn't know what methods exists
      // await contract.methods.ERC20SwapERC721(contractAddress).call();

      // await contract.methods
      //   .ERC20SwapERC721(1)
      //   .send({
      //     from: user.wallet.address,
      //     gas: "0x47888",
      //     value: toWei("0.001", "ether"),
      //   })
      //   .then(function (receipt) {
      //     // other parts of code to use receipt
      //     console.log("receipt", receipt);
      //   })
      //   .catch((err) => {
      //     console.error(err);
      //   });
    });
  }

  // 签名
  const sign = (address: string, message: string) => {
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
      ethereum?.on("accountChanged", handleAccountsChanged);
    })();
    return () => {
      console.log("解绑accountChanged事件");
      ethereum?.removeListener("accountChanged", handleAccountsChanged);
    };
  }, []);

  // 用户变化
  async function handleAccountsChanged(accounts: Array<string>) {
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
