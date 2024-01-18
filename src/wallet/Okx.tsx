import CustomToast from "@/components/common/CustomToast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { SET_WALLET_INSTALL } from "@/store/reducer";
import { BTC_Unit_Converter, isOKApp } from "@/utils";
import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useState,
} from "react";
/*
 * @LastEditors: John
 * @Date: 2024-01-02 12:58:36
 * @LastEditTime: 2024-01-18 09:41:02
 * @Author: John
 */
type Account = {
  address: string;
  compressedPublicKey: string;
  publicKey: string;
};
// let connecting = false; // TODO 优化connecting状态✔
export type Okx_HandleType = {
  _connect: () => Promise<string>;
  _disConnect: () => Promise<void>;
  _onSubmit: (cost: number, toAddress: string) => Promise<string>;
  _sign: (address: string, message: string) => Promise<string>;
};

const Okx = forwardRef<
  Okx_HandleType,
  {
    handleAccountsChanged: (addressInfo: Account | null) => void;
    checkInstalledOk: () => Promise<void>;
  }
>(function (props, ref) {
  const [publicKey, setPublicKey] = useState("");
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  // const [dialogOpen, setDialogOpen] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      _connect() {
        return connect();
      },
      _disConnect() {
        return disConnect();
      },
      _onSubmit(cost, toAddress) {
        return onSubmit(cost, toAddress);
      },
      _sign(address, message) {
        return sign(address, message);
      },
    };
  });

  const okxwallet = window.okxwallet;

  useLayoutEffect(() => {
    (async () => {
      await checkinstall();
      await props.checkInstalledOk();
      // 监听账户变化
      // TODO 移动端无法触发？？？
      console.log("绑定accountChanged事件");
      okxwallet?.bitcoin?.on("accountChanged", handleAccountsChanged);
    })();
    return () => {
      console.log("解绑accountChanged事件");
      okxwallet?.bitcoin?.removeListener(
        "accountChanged",
        handleAccountsChanged
      );
    };
  }, []);

  // 检测是否安装okx
  function checkinstall(): Promise<void> {
    return new Promise((reslove, reject) => {
      if (typeof okxwallet !== "undefined") {
        console.log("OKX is installed!");
        // setOkxInstalled(true);
        dispatch(SET_WALLET_INSTALL(true));
        reslove();
      } else {
        // 提示用户没有安装OKX插件
        console.warn("OKX is not installed!!");
        // setOkxInstalled(false);
        dispatch(SET_WALLET_INSTALL(false));
        CustomToast("You haven't installed a wallet yet！");
      }
    });
  }

  // 连接钱包
  async function connect() {
    return new Promise<string>(async (reslove, reject) => {
      await checkinstall();
      okxwallet?.bitcoin
        .connect()
        .then(async (result: Account | null) => {
          console.log("okxwallet.bitcoin.connect", result);
          if (!result) return CustomToast("The wallet does not support.");
          reslove(result.address);
        })
        .catch(handleCatch);
    });
  }

  // 断开连接
  async function disConnect() {
    if (!isOKApp) {
      await okxwallet?.bitcoin.disconnect();
    }
  }

  // 用户变化
  // Account
  async function handleAccountsChanged(addressInfo: Account) {
    // clearUserData();
    props.handleAccountsChanged(addressInfo);
  }

  // 提交发送交易
  function onSubmit(cost: number, toAddress: string) {
    return new Promise<string>((reslove, reject) => {
      // reslove(false);
      console.log("okxwallet.bitcoin", okxwallet?.bitcoin);
      if (typeof okxwallet?.bitcoin === "undefined") return;
      console.log(
        "values.satoshis * BTC_Unit_Converter",
        cost * BTC_Unit_Converter
      );
      // console.log(address, toAddress, cost * BTC_Unit_Converter);
      console.log("send", okxwallet.bitcoin.send);
      try {
        okxwallet.bitcoin
          .send({
            from: user.wallet.address,
            to: toAddress,
            value: cost,
          })
          .then((txid: { txhash: string }) => {
            // console.log(txid);

            // CustomToast(`请求交易成功,txid值为：${txid.txhash}`);

            reslove(txid.txhash);
          })
          .catch((e: any) => {
            console.log("用户取消交易");
            handleCatch(e);
          });
      } catch (error) {
        console.log("okxwallet.bitcoin.send错误：", error);
      }
    });
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

  // 签名
  async function sign(address: string, message: string): Promise<string> {
    return new Promise((reslove, reject) => {
      // let address = localStorage.getItem(localStorageKey.okx_address);
      // TODO 签名✔
      // const nonce = "22a68408-fea7-4491-996c-a92fbf710a72";
      // const message = `Welcome to OKX!\n\nThis request will not trigger a blockchain transaction.\n    \nYour authentication status will reset after 24 hours.\n    \nWallet address:\n${result.address}\n    \nNonce:\n${nonce}\n`;
      // const message = "need sign string";
      console.log("签名?");
      okxwallet?.bitcoin
        .signMessage(message, { from: address }) // OKX app 钱包新的签名方法传参（官网的方法传参不对）！！！！
        .then(async (sign: string) => {
          console.log("okx signature:", sign);
          reslove(sign);
        })
        .catch(handleCatch);
    });
  }

  return <></>;
});

export default Okx;
