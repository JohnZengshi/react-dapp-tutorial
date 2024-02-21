import {
  useState,
  useEffect,
  useMemo,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { formatBalance, formatValue } from "@/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
import { BrowserProvider } from "ethers";
// import { useSDK } from "@metamask/sdk-react";
import detectEthereumProvider from "@metamask/detect-provider";
import CustomToast from "@/components/common/CustomToast";
import { WALLET_ARBITRUM_ONE, WALLET_ETHEREUM } from "@/constant/wallet";
import { useAppSelector } from "@/store/hooks";
import { ChainType } from "@/store/reducer";

export type MetaMask_HandleType = {
  _connect: (chainType: ChainType) => Promise<string>;
  _disConnect?: () => Promise<void>;
  _onSubmit?: (cost: number, toAddress: string) => Promise<string>;
  _sign?: (address: string, message: string) => Promise<string>;
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
      //   // return disConnect(); TODO disConnect
      // },
      // _onSubmit(cost: number, toAddress: string) {
      //   // return onSubmit(cost, toAddress); TODO onSubmit
      // },
      // _sign(address, message) {
      //   // return sign(address, message); TODO sign
      // },
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
          method: "eth_requestAccounts",
        });
        if (res) {
          if (chainType == "ETHEREUM") {
            await ethereum?.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: WALLET_ETHEREUM.chainId }],
            });
          } else if (chainType == "Arbitrum One") {
            await ethereum?.request({
              method: "wallet_addEthereumChain",
              params: [WALLET_ARBITRUM_ONE],
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
  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   // Do something with the form values.
  //   // ✅ This will be type-safe and validated.
  //   console.log("form:", values);
  //   if (sendingTransaction) return;

  //   const params = [
  //     {
  //       from: account, // The user's active address.
  //       to: values.to, // Required except during contract publications.
  //       // value: utils.toWei(values.value, 'ether'), // Only required to send ether to the recipient from the initiating external account.
  //       value: formatValue(values.value),
  //     },
  //   ];
  //   console.log("params:", params);
  //   setSendingTransaction(true);

  //   provider
  //     ?.request({ method: "eth_sendTransaction", params })
  //     .then((txHash: any) => {
  //       setSendingTransaction(false);
  //       console.log(txHash);
  //       // alert("Hash值为：" + txHash)
  //       toast({
  //         title: "交易处理中",
  //         description: "Hash值为：" + txHash,
  //       });

  //       setOpen(false);
  //     })
  //     .catch((error: any) => {
  //       setSendingTransaction(false);
  //       toast({
  //         variant: "destructive",
  //         title: "Uh oh! Something went wrong.",
  //         description: error.message,
  //         action: <ToastAction altText="Try again">Try again</ToastAction>,
  //       });
  //       console.error(error);
  //     });
  // }
  // 登录
  // const siweSign = async (siweMessage: string) => {
  //   setSiweSignLoading(true);
  //   try {
  //     const from = account;
  //     const msg = `0x${Buffer.from(siweMessage, "utf8").toString("hex")}`;
  //     const sign = await provider?.request({
  //       method: "personal_sign",
  //       params: [msg, from],
  //     });
  //     console.log(sign);
  //     if (typeof sign == "string") setSiweSignStr(sign);
  //     setSiweSignLoading(false);
  //   } catch (err: any) {
  //     console.error(err);
  //     toast({
  //       variant: "destructive",
  //       title: "Uh oh! Something went wrong.",
  //       description: err.message,
  //       action: <ToastAction altText="Try again">Try again</ToastAction>,
  //     });
  //     setSiweSignLoading(false);
  //   }
  // };
  // async function createSiweMessage(statement: string) {
  //   const domain = window.location.host;
  //   const origin = window.location.origin;
  //   const provider = new BrowserProvider(window.ethereum);
  //   const signer = await provider.getSigner();
  //   const siweMessage = new SiweMessage({
  //     domain,
  //     address: signer.address,
  //     statement,
  //     uri: origin,
  //     version: "1",
  //     nonce: "32891757",
  //     chainId: 1,
  //   });

  //   console.log(siweMessage);
  //   return siweMessage.prepareMessage();
  // }

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
      await props.checkInstalledOk(); // TODO checkInstalledOk
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
    // console.log("accounts", accounts);
    props.handleAccountsChanged(accounts[0]); // TODO handleAccountsChanged
  }

  return <></>;
});

export default MetaMask;
