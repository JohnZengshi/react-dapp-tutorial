import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import sdk from "@unisat/wallet-sdk";
import { verifyMessage } from "@unisat/wallet-utils";
import { BTC_Unit_Converter } from "@/utils";

const formSchema = z.object({
  toAddress: z.string(),
  satoshis: z.number().positive(),
});

let connecting = false;
export type UniSat_handleType = {
  _connect: () => void;
  _disConnect: () => void;
  _onSubmit: (cost: number, toAddress: string) => Promise<boolean>;
};
const UniSat = forwardRef<
  UniSat_handleType,
  {
    onUpdate: (
      okxInstalled: boolean,
      connected: boolean,
      address: string | undefined
    ) => void;
  }
>(function (props, ref) {
  const [unisatInstalled, setUnisatInstalled] = useState(false);
  const [connected, setConnected] = useState(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [publicKey, setPublicKey] = useState("");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState({
    confirmed: 0,
    unconfirmed: 0,
    total: 0,
  });
  const [network, setNetwork] = useState("livenet");
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState<Boolean>(false);
  // const [connecting, setConnecting] = useState<boolean>(false);

  useImperativeHandle(ref, () => {
    return {
      _connect() {
        connect();
      },
      _disConnect() {
        disConnect();
      },
      _onSubmit(cost: number, toAddress: string) {
        return onSubmit(cost, toAddress);
      },
    };
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      toAddress: "",
      satoshis: 0,
    },
  });

  useEffect(() => {
    props.onUpdate(unisatInstalled, connected, address);
  }, [unisatInstalled, connected, address]);

  const getBasicInfo = async () => {
    const unisat = (window as any).unisat;
    const [address] = await unisat.getAccounts();
    setAddress(address);

    const publicKey = await unisat.getPublicKey();
    setPublicKey(publicKey);

    const balance = await unisat.getBalance();
    setBalance(balance);

    const network = await unisat.getNetwork();
    setNetwork(network);
  };

  const selfRef = useRef<{ accounts: string[] }>({
    accounts: [],
  });
  const self = selfRef.current;
  const handleAccountsChanged = (_accounts: string[]) => {
    if (self.accounts[0] === _accounts[0]) {
      // prevent from triggering twice
      console.log("prevent from triggering twice");
      // return;
    }
    self.accounts = _accounts;
    console.log("_accounts", _accounts);
    if (_accounts.length > 0) {
      setAccounts(_accounts);
      setConnected(true);
      getBasicInfo();
    } else {
      setConnected(false);
      disConnect(); // 手动触发
    }
  };

  const handleNetworkChanged = (network: string) => {
    setNetwork(network);
    getBasicInfo();
  };

  // 发送交易
  function onSubmit(cost: number, toAddress: string): Promise<boolean> {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    return new Promise((reslove, reject) => {
      console.log(
        "values.satoshis * BTC_Unit_Converter",
        cost * BTC_Unit_Converter
      );
      if (sending) return;

      setSending(true);
      unisat
        .sendBitcoin(
          toAddress, // Required except during contract publications.
          Math.round(cost * BTC_Unit_Converter)
        )
        .then((txHash: string) => {
          setSending(false);
          console.log(txHash);
          // alert("Hash值为：" + txHash)
          toast({
            title: "交易成功",
            description: "Hash值为：" + txHash,
          });

          reslove(true);
          setOpen(false);
        })
        .catch((error: any) => {
          setSending(false);
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.message,
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
          // console.error(error);
        });
    });
  }

  async function connect() {
    if (connecting) return;
    await checkInstall();
    // setConnecting(true);
    connecting = true;
    unisat
      .requestAccounts()
      .then(async (accounts: string[]) => {
        console.log("request accounts", accounts);
        if (accounts.length > 0) {
          await signMessage(accounts[0]);
          handleAccountsChanged(accounts);
          connecting = false;
        }
      })
      .catch(handleCatch);
  }

  function disConnect() {
    console.log("dis connect");

    setAccounts([]);
    setConnected(false);
    setAddress("");
    setPublicKey("");
    setBalance({
      confirmed: 0,
      unconfirmed: 0,
      total: 0,
    });
    setNetwork("livenet");
  }

  function checkInstall() {
    return new Promise<void>(async (reslove, reject) => {
      let unisat = (window as any).unisat;

      for (let i = 1; i < 5 && !unisat; i += 1) {
        await new Promise((resolve) => setTimeout(resolve, 100 * i));
        unisat = (window as any).unisat;
      }

      if (unisat) {
        console.log("unisat is installed!!", unisat);
        setUnisatInstalled(true);
      } else if (!unisat) {
        // 用户没有安装unisat插件
        console.warn("unisat is not installed!!");

        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "PLEASE INSTALL UNISAT WALLET",
        });
        reject();
        return;
      }

      reslove();
    });
  }

  async function signMessage(address: string) {
    return new Promise<void>(async (reslove, reject) => {
      try {
        const nonce = "22a68408-fea7-4491-996c-a92fbf710a72";
        const message = `Welcome to UniSat!\n\nClick to sign in and accept the UniSat Terms of Service (https://unisat.io/terms-of-service.html) and Privacy Policy (https://unisat.io/privacy-policy.html).\n    \nThis request will not trigger a blockchain transaction.\n    \nYour authentication status will reset after 24 hours.\n    \nWallet address:\n${address}\n    \nNonce:\n${nonce}\n`;
        let res = await window.unisat.signMessage(message);
        console.log("signature:", res);
        // const pubkey = publicKey;
        // const message = "abcdefghijk123456789";
        // const signature = res;
        // const result = verifyMessage(pubkey, message, signature);
        // console.log("verifyMessage:", result);
        reslove();
      } catch (e) {
        console.log(e);
      }
    });
  }
  useLayoutEffect(() => {
    async function checkUnisat() {
      await checkInstall();
      unisat
        .getAccounts()
        .then((accounts: string[]) => {
          console.log("unisat accounts", accounts);
          if (accounts.length > 0) {
            handleAccountsChanged(accounts);
          } else {
            connect();
          }
        })
        .catch(handleCatch);

      unisat.on("accountsChanged", handleAccountsChanged);
      unisat.on("networkChanged", handleNetworkChanged);

      return () => {
        unisat.removeListener("accountsChanged", handleAccountsChanged);
        unisat.removeListener("networkChanged", handleNetworkChanged);
      };
    }

    checkUnisat().then();
  }, []);

  const unisat = (window as any).unisat;

  function handleCatch(e: { code: number; message: string }) {
    // console.log(e);
    if (e.code === 4001) {
      // 用户没有创建钱包
      console.warn(e.message);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: e.message,
      });
    }
  }
  return <></>;
});

export default UniSat;
