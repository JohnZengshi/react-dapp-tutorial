import CustomToast from "@/components/common/CustomToast";
import {
  BTC_Unit_Converter,
  isOKApp,
  localStorageKey,
  stringToHex,
} from "@/utils";
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
 * @LastEditTime: 2024-01-10 12:50:32
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
  _onSubmit: (cost: number, toAddress: string) => Promise<string>;
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
    (async () => {
      await checkinstall();
      await connect();
      // 监听账户变化
      okxwallet.bitcoin?.on("accountChanged", handleAccountsChanged);
    })();

    return () => {
      okxwallet?.bitcoin?.removeListener(
        "accountsChanged",
        handleAccountsChanged
      );
    };
  }, []);

  useEffect(() => {
    props.onUpdate(okxInstalled, connected, address);
  }, [okxInstalled, connected, address]);

  // 检测是否安装okx
  function checkinstall(): Promise<void> {
    return new Promise((reslove, reject) => {
      if (typeof okxwallet !== "undefined") {
        console.log("OKX is installed!");
        setOkxInstalled(true);
        reslove();
      } else {
        // 提示用户没有安装OKX插件
        console.warn("OKX is not installed!!");
        setOkxInstalled(false);
        CustomToast("You haven't installed a wallet yet！");
      }
    });
  }

  async function connect() {
    return new Promise<void>(async (reslove, reject) => {
      await checkinstall();
      if (connecting) return;
      connecting = true;
      okxwallet.bitcoin
        .connect()
        .then(async (result: Account) => {
          // TODO 判断是否有token，没有则签名请求获取token
          // TODO 签名✔
          // const nonce = "22a68408-fea7-4491-996c-a92fbf710a72";
          // const message = `Welcome to OKX!\n\nThis request will not trigger a blockchain transaction.\n    \nYour authentication status will reset after 24 hours.\n    \nWallet address:\n${result.address}\n    \nNonce:\n${nonce}\n`;
          const message = `userAddressSignature:abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`;
          // const message = "need sign string";
          // try {
          //   okxwallet.bitcoin
          //     .signMessage(message, { from: result.address }) // OKX app 钱包新的签名方法传参（官网的方法传参不对）！！！！
          //     .then((sign: string) => {
          //       console.log("get sign:", sign);
          //     });
          // } catch (error) {
          //   console.warn(error);
          // }

          // TODO 登录
          setAddress(result.address);
          setConnected(true);
          connecting = false;
          localStorage.setItem(localStorageKey.okx_address, result.address);
          reslove();
        })
        .catch(handleCatch);
    });
  }

  async function disConnect() {
    await okxwallet.bitcoin.disconnect();
    setAddress("");
    setConnected(false);
    localStorage.removeItem(localStorageKey.okx_address);
  }

  // 用户变化
  function handleAccountsChanged(addressInfo: Account) {
    if (addressInfo === null) {
      setConnected(false);
      setAddress("");
      localStorage.removeItem(localStorageKey.okx_address);
    } else {
      setAddress(addressInfo.address);
    }
  }

  // 提交发送交易
  function onSubmit(cost: number, toAddress: string) {
    return new Promise<string>((reslove, reject) => {
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
        .then((txid: string) => {
          console.log(txid);

          CustomToast(`交易成功,txid值为：${txid}`);

          reslove(txid);
        })
        .catch(handleCatch);
    });
  }

  // 统一处理错误
  function handleCatch(e: { code: number; message: string }) {
    console.log(e);
    connecting = false;
    if (typeof e.message === "string") {
      console.warn(e.message);
      // toast({
      //   variant: "destructive",
      //   title: "Uh oh! Something went wrong.",
      //   description: e.message,
      // });
    }
  }
  return <></>;
});

export default Okx;
