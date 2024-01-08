import { toast } from "@/components/ui/use-toast";
import { BTC_Unit_Converter } from "@/utils";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

/*
 * @LastEditors: John
 * @Date: 2024-01-02 12:58:36
 * @LastEditTime: 2024-01-08 16:26:16
 * @Author: John
 */
type Account = {
  address: string;
  compressedPublicKey: string;
  publicKey: string;
};
let connecting = false;
export type Okx_HandleType = {
  _connect: () => void;
  _disConnect: () => void;
  _onSubmit: (cost: number, toAddress: string) => Promise<boolean>;
};

const Okx = forwardRef<
  Okx_HandleType,
  {
    onUpdate: (
      okxInstalled: boolean,
      connected: boolean,
      address: string | undefined
    ) => void;
  }
>(function (props, ref) {
  const [okxInstalled, setOkxInstalled] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<string>();

  useImperativeHandle(ref, () => {
    return {
      _connect() {
        connect();
      },
      _disConnect() {
        disConnect();
      },
      _onSubmit(cost, toAddress) {
        return onSubmit(cost, toAddress);
      },
    };
  });

  const okxwallet = window.okxwallet;

  useLayoutEffect(() => {
    const ua = navigator.userAgent;
    const isIOS = /iphone|ipad|ipod|ios/i.test(ua);
    const isAndroid = /android|XiaoMi|MiuiBrowser/i.test(ua);
    const isMobile = isIOS || isAndroid;
    const isOKApp = /OKApp/i.test(ua);

    if (isMobile && !isOKApp) {
      // 在欧易移动端中打开您的 DApp
      // const dappUrl = "https://roos-test.fcaex.vip/";
      // const encodedUrl =
      //   "https://www.okx.com/download?deeplink=" +
      //   encodeURIComponent(
      //     "okx://wallet/dapp/url?dappUrl=" + encodeURIComponent(location.href)
      //   );
      // window.location.href = encodedUrl;
      // console.log("window.location.href", window.location.href);
      // window.open(`okx://wallet/dapp/details?dappUrl=${dappUrl}`);
    } else {
      // console.log("window.ethereum", window.ethereum);
      // window.ethereum?.on("chainChanged", handleChainChanged);
      // function handleChainChanged(chainId: any) {
      //   console.log("chainChanged:", chainId);
      //   // We recommend reloading the page, unless you must do otherwise.
      // }
    }

    init();
  }, []);

  useEffect(() => {
    props.onUpdate(okxInstalled, connected, address);
  }, [okxInstalled, connected, address]);

  async function init() {
    if (typeof okxwallet !== "undefined") {
      console.log("OKX is installed!");
      setOkxInstalled(true);

      // okxwallet.bitcoin
      //   .getAccounts()
      //   .then((address: string[]) => {
      //     console.log("get accounts:", address);
      //     if (address.length > 0) {
      //       handleAccountsChanged(address[0]);
      //       setConnected(true);
      //     } else {
      //       connect();
      //     }
      //   })
      //   .catch(handleCatch);

      connect();

      // 监听账户变化
      okxwallet.bitcoin.on("accountChanged", (addressInfo: Account) => {
        console.log("accounts changed:", addressInfo);
        if (addressInfo === null) {
          setConnected(false);
          setAddress("");
        } else {
          handleAccountsChanged(addressInfo.address);
        }
      });
      // connect();
    } else {
      // 用户没有安装OKX插件
      console.warn("OKX is not installed!!");
    }
  }

  async function connect() {
    if (connecting) return;

    connecting = true;
    okxwallet.bitcoin
      .connect()
      .then(async (result: Account) => {
        // 签名
        // TODO 移动端报错？？
        // const nonce = "22a68408-fea7-4491-996c-a92fbf710a72";
        // const message = `Welcome to OKX!\n\nThis request will not trigger a blockchain transaction.\n    \nYour authentication status will reset after 24 hours.\n    \nWallet address:\n${result.address}\n    \nNonce:\n${nonce}\n`;
        // okxwallet.bitcoin
        //   .signMessage(message, "ecdsa")
        //   .then((sign: string) => {
        //     console.log("get sign:", sign);
        handleAccountsChanged(result.address);
        setConnected(true);
        connecting = false;
        //   })
        //   .catch(handleCatch);
      })
      .catch(handleCatch);
  }

  async function disConnect() {
    await okxwallet.bitcoin.disconnect();
    setAddress("");
    setConnected(false);
  }

  async function updateBalance(address: string) {}

  function handleAccountsChanged(address: string) {
    setAddress(address);
    // updateBalance(address);
  }

  function onSubmit(cost: number, toAddress: string) {
    return new Promise<boolean>((reslove, reject) => {
      // reslove(false);
      console.log("okxwallet.bitcoin", okxwallet.bitcoin);
      if (typeof okxwallet.bitcoin === "undefined") return;
      console.log(
        "values.satoshis * BTC_Unit_Converter",
        cost * BTC_Unit_Converter
      );
      // console.log(address, toAddress, cost * BTC_Unit_Converter);
      console.log("send", okxwallet.bitcoin.send);
      okxwallet.bitcoin
        .send({
          from: address,
          to: toAddress,
          value: cost,
        })
        // TODO sendBitcoin无法在移动端使用？
        // .sendBitcoin(toAddress, cost * BTC_Unit_Converter)
        .then((txid: string) => {
          console.log(txid);

          toast({
            title: "交易成功",
            description: "txid值为：" + txid,
          });

          reslove(true);
        })
        .catch(handleCatch);
    });
  }

  function handleCatch(e: { code: number; message: string }) {
    console.log(e);
    connecting = false;
    if (typeof e.message === "string") {
      // console.warn(e.message);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: e.message,
      });
    }
  }
  return <></>;
});

export default Okx;
