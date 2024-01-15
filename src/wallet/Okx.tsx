import CustomToast from "@/components/common/CustomToast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  SET_ADDRESS,
  SET_CONNECTED,
  SET_LOGINSTATUS,
  SET_THIRD_INVITE_CODE,
  SET_USER_INVITATION_CODE,
  SET_WALLET_CONNECTING,
  SET_WALLET_INSTALL,
} from "@/store/reducer";
import {
  BTC_Unit_Converter,
  UrlQueryParamsKey,
  getUrlQueryParam,
  isOKApp,
  localStorageKey,
  stringToHex,
} from "@/utils";
import {
  API_CHECK_INVITE_CODE,
  API_CHECT_EXIT,
  API_GET_USER_SIGNATURE,
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
import { Md5 } from "ts-md5";
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
  _comfireBinding: (inviteCode: string) => void;
};

const Okx = forwardRef<
  Okx_HandleType,
  {
    onUpdate: (
      okxInstalled: boolean,
      connected: boolean,
      address: string | undefined
    ) => void;
    shouldIputInviteCode: (code?: string) => void;
    checkInputInviteCodeOk: () => void;
  }
>(function (props, ref) {
  // const [okxInstalled, setOkxInstalled] = useState<boolean>(false);
  // const [connected, setConnected] = useState<boolean>(false);
  // const [address, setAddress] = useState<string>();
  // const [invitationCode, setInvitationCode] = useState("");
  // const connecting = useAppSelector((state) => state.user.wallet.connecting);
  // const dispath = useAppDispatch();
  const [publicKey, setPublicKey] = useState("");
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  // const [dialogOpen, setDialogOpen] = useState(false);

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
      async _comfireBinding(intiveCode) {
        //TODO 用户输入邀请码后登录✔
        try {
          await signUp(intiveCode);
        } catch (error) {
          return;
        }
        let address = localStorage.getItem(localStorageKey.okx_address);
        if (address) {
          signAnLogin(publicKey, address);
          props.checkInputInviteCodeOk();
        }
      },
    };
  });

  const okxwallet = window.okxwallet;

  useLayoutEffect(() => {
    (async () => {
      await checkinstall();
      await connect();
      // 监听账户变化
      // TODO 移动端无法触发？？？
      console.log("绑定accountChanged事件");
      okxwallet.bitcoin?.on("accountChanged", handleAccountsChanged);

      return () => {
        console.log("解绑accountChanged事件");
        okxwallet?.bitcoin?.removeListener(
          "accountChanged",
          handleAccountsChanged
        );
      };
    })();
  }, []);

  // useEffect(() => {
  //   props.onUpdate(okxInstalled, connected, address);
  // }, [okxInstalled, connected, address]);

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
    return new Promise<void>(async (reslove, reject) => {
      await checkinstall();
      // if (user.wallet.connecting) return;
      // connecting = true;
      // dispatch(SET_WALLET_CONNECTING(true));

      okxwallet.bitcoin
        .connect()
        .then(async (result: Account) => {
          // TODO 钱包连接完就保存地址✔
          localStorage.setItem(localStorageKey.okx_address, result.address);

          let res = await checkToken(result.address);
          if (res == "CONFIRM_THE_INVITATION_CODE") {
            reslove();
            return;
          }
          reslove();
        })
        .catch(handleCatch);
    });
  }

  // 注册
  async function signUp(inviteCode: string) {
    // TODO 注册✔
    let address = localStorage.getItem(localStorageKey.okx_address);

    if (address) {
      await API_SIGNUP(address, inviteCode, publicKey);
    }
  }

  // 签名并且登录
  async function signAnLogin(publicKey: string, address: string) {
    // let address = localStorage.getItem(localStorageKey.okx_address);
    // TODO 签名✔
    // const nonce = "22a68408-fea7-4491-996c-a92fbf710a72";
    // const message = `Welcome to OKX!\n\nThis request will not trigger a blockchain transaction.\n    \nYour authentication status will reset after 24 hours.\n    \nWallet address:\n${result.address}\n    \nNonce:\n${nonce}\n`;
    const message = `userAddressSignature:abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`;
    // const message = "need sign string";
    okxwallet.bitcoin
      .signMessage(message, { from: address }) // OKX app 钱包新的签名方法传参（官网的方法传参不对）！！！！
      .then(async (sign: string) => {
        // console.log("get sign:", sign);
        if (!address) return;

        // TODO MD5加密
        let signature = await API_GET_USER_SIGNATURE(address);
        const signStr = `${address}${signature.encryptedString}`;
        console.log("signStr", signStr);

        // TODO 登录✔
        let loginInfo = await API_LOGIN(
          address,
          Md5.hashStr(signStr),
          publicKey
        );

        if (loginInfo) {
          console.log(loginInfo);
          localStorage.setItem(
            localStorageKey.roos_token,
            `${address}::::${loginInfo.token}`
          );
          // TODO 只在这里写入用户数据✔
          saveUserData(address);
        }
      })
      .catch(handleCatch);
  }

  // 检测token
  async function checkToken(
    address: string
  ): Promise<"CONFIRM_THE_INVITATION_CODE" | void> {
    const roos_token = localStorage.getItem(localStorageKey.roos_token);
    console.log("roos_token", roos_token);
    // TODO 判断是否有token，没有则签名请求获取token✔
    if (!roos_token || roos_token?.split("::::")[0] != address) {
      // TODO 判断用户是否注册✔

      // TODO 获取publickey 欧易app内无法获取？？？
      let pk = "";
      if (!isOKApp) {
        pk = await okxwallet.bitcoin.getPublicKey();
        if (!pk) {
          CustomToast("get public key fail!");
          return;
        }
        setPublicKey(pk);
      } else {
        // TODO app内写死key
        pk =
          "0305ef2a74bff2e2d68764c557ce2daecac92caa7a9406e3a90c2cf7c5b444a154";
      }

      if (!(await API_CHECT_EXIT(address))) {
        // TODO 获取页面连接的invite code，弹窗提示，默认测试：NODE123✔
        let urlInviteCode = getUrlQueryParam(UrlQueryParamsKey.INVITE_CODE);
        if (!urlInviteCode) {
          // TODO 弹窗提示输入邀请码✔
          props.shouldIputInviteCode("");
          // return CustomToast("the invitation code does not exist!");
        } else {
          props.shouldIputInviteCode(urlInviteCode);
          dispatch(SET_THIRD_INVITE_CODE(urlInviteCode));
        }
        return "CONFIRM_THE_INVITATION_CODE";
      }

      signAnLogin(pk, address);
    } else {
      // TODO 用户已经登录，直接保存数据✔
      saveUserData(address);
    }
  }

  async function disConnect() {
    if (!isOKApp) {
      await okxwallet.bitcoin.disconnect();
    }
    clearUserData();
  }

  // 用户变化
  // Account
  async function handleAccountsChanged(addressInfo: Account) {
    clearUserData();
    console.log("account change!", addressInfo);
    if (addressInfo) {
      let res = await checkToken(addressInfo.address);
      if (res == "CONFIRM_THE_INVITATION_CODE") {
        return;
      }
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
          from: user.wallet.address,
          to: toAddress,
          value: cost,
        })
        .then((txid: { txhash: string }) => {
          console.log(txid);

          CustomToast(`交易成功,txid值为：${txid.txhash}`);

          reslove(txid.txhash);
        })
        .catch((e: any) => {
          handleCatch(e);
          reject("");
        });
    });
  }

  function saveUserData(address: string) {
    dispatch(SET_LOGINSTATUS("LOGIN"));
    dispatch(SET_CONNECTED(true));
    dispatch(SET_ADDRESS(address));
    localStorage.setItem(localStorageKey.okx_address, address);
  }

  function clearUserData() {
    dispatch(SET_LOGINSTATUS("LOG_OUT"));
    dispatch(SET_CONNECTED(false));
    dispatch(SET_ADDRESS(""));
    localStorage.removeItem(localStorageKey.okx_address);
    localStorage.removeItem(localStorageKey.roos_token);
  }
  // 统一处理错误
  function handleCatch(e: { code: number; message: string }) {
    console.log(e);
    // connecting = false;
    // dispatch(SET_WALLET_CONNECTING(false));
    if (typeof e.message === "string") {
      console.warn(e.message);
      CustomToast(e.message);
    }
  }

  return <></>;
});

export default Okx;
