import CustomToast from "@/components/common/CustomToast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  SET_USER_INVITATION_CODE,
  SET_WALLET_CONNECTING,
} from "@/store/reducer";
import {
  BTC_Unit_Converter,
  fetchUrl,
  isOKApp,
  localStorageKey,
  stringToHex,
} from "@/utils";
import {
  API_CHECK_INVITE_CODE,
  API_CHECT_EXIT,
  API_LOGIN,
  API_SIGNUP,
} from "@/utils/api";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useReducer,
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
// let connecting = false; // TODO 优化connecting状态✔
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
  const [invitationCode, setInvitationCode] = useState("");
  const connecting = useAppSelector((state) => state.user.wallet.connecting);
  const dispath = useAppDispatch();
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
      // connecting = true;
      dispath(SET_WALLET_CONNECTING(true));

      okxwallet.bitcoin
        .connect()
        .then(async (result: Account) => {
          // TODO 判断是否有token，没有则签名请求获取token✔
          const roos_token = localStorage.getItem(localStorageKey.roos_token);
          console.log("roos_token", roos_token);

          if (!roos_token) {
            await (() => {
              return new Promise<void>(async (reslove, reject) => {
                // TODO 判断用户是否注册✔
                if (!(await API_CHECT_EXIT(result.address))) {
                  // TODO 注册✔
                  await API_SIGNUP(result.address);
                }

                let publicKey = await okxwallet.bitcoin.getPublicKey();

                // TODO 签名✔
                // const nonce = "22a68408-fea7-4491-996c-a92fbf710a72";
                // const message = `Welcome to OKX!\n\nThis request will not trigger a blockchain transaction.\n    \nYour authentication status will reset after 24 hours.\n    \nWallet address:\n${result.address}\n    \nNonce:\n${nonce}\n`;
                const message = `userAddressSignature:abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`;
                // const message = "need sign string";
                okxwallet.bitcoin
                  .signMessage(message, { from: result.address }) // OKX app 钱包新的签名方法传参（官网的方法传参不对）！！！！
                  .then(async (sign: string) => {
                    console.log("get sign:", sign);

                    // TODO 登录✔
                    let loginInfo = await API_LOGIN(
                      result.address,
                      sign,
                      publicKey
                    );

                    if (loginInfo) {
                      console.log(loginInfo);
                      localStorage.setItem(
                        localStorageKey.roos_token,
                        loginInfo.token
                      );

                      // TODO 查询用户邀请码
                      let invitationCode = await API_CHECK_INVITE_CODE();
                      if (invitationCode)
                        dispath(SET_USER_INVITATION_CODE(invitationCode));

                      reslove();
                    }
                  })
                  .catch(handleCatch);
              });
            })();
          }

          localStorage.setItem(localStorageKey.okx_address, result.address);
          setAddress(result.address);
          setConnected(true);
          // connecting = false;
          dispath(SET_WALLET_CONNECTING(true));
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
    // connecting = false;
    dispath(SET_WALLET_CONNECTING(false));
    if (typeof e.message === "string") {
      console.warn(e.message);
      CustomToast(e.message);
    }
  }
  return <></>;
});

export default Okx;
