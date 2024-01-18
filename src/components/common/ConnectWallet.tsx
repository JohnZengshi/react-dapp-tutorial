import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  Fragment,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import UseOkx, { Okx_HandleType } from "@/wallet/Okx";
import UseUniSat, { UniSat_handleType } from "@/wallet/UniSat";
import {
  UrlQueryParamsKey,
  fillArray,
  getUrlQueryParam,
  isOKApp,
  localStorageKey,
  sessionStorageKey,
  shortenString,
} from "@/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import "./ConnectWallet.scss";
import "./ConnectWallet-m.scss";
import okx_logo from "@/assets/okx_logo.png";
import unisat_logo from "@/assets/unisat_logo.png";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  SET_ADDRESS,
  SET_CONNECTED,
  SET_LOGINSTATUS,
  SET_NOTIFICATION_TRIGGER_EVENT,
  SET_PAY_INFO,
  SET_THIRD_INVITE_CODE,
  SET_WALLET_INSTALL,
  SET_WALLET_TYPE,
  WalletType,
} from "@/store/reducer";
import { useNavigate } from "react-router-dom";
import { IoMdExit } from "react-icons/io";
import CustomToast from "./CustomToast";
import {
  API_CHECT_EXIT,
  API_GET_USER_SIGNATURE,
  API_LOGIN,
  API_PAY_NODE_SMS,
  API_SIGNUP,
} from "@/utils/api";
import { Md5 } from "ts-md5";
/*
 * @LastEditors: John
 * @Date: 2024-01-02 14:40:57
 * @LastEditTime: 2024-01-03 14:29:20
 * @Author: John
 */
export type ConnectWallet_handleType = {
  _onSubmit: (cost: number, toAddress: string) => Promise<string>;
  _setWalletType: (type: WalletType) => void;
  _selectWallet: () => void;
};
const ConnectWallet = forwardRef<ConnectWallet_handleType, {}>(function (
  props,
  ref
) {
  const [open, setOpen] = useState(false);

  const okxRef = useRef<Okx_HandleType>(null);
  const uniSatRef = useRef<UniSat_handleType>(null);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [inviteCodeDialogOpen, setInviteCodeDialogOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState<string>("");
  const [publicKey, setPublicKey] = useState("");

  useEffect(() => {
    switch (user.wallet.notificationTriggerEvent) {
      case "SELECT_WALLET": // 选择钱包
        dispatch(SET_NOTIFICATION_TRIGGER_EVENT(""));
        setOpen(true);

        break;
      case "CONNECT": // 连接
        dispatch(SET_NOTIFICATION_TRIGGER_EVENT(""));

        break;
      case "TRANSACTION": // 发送交易
        dispatch(SET_NOTIFICATION_TRIGGER_EVENT(""));
        // let hash = await onSubmit(
        //   orderInfo.data.buyAmount,
        //   "bc1p0xjywgpgdcy2ps5naqf4m44zkqptuejnk6226dwt0v3gcqv8alvqtppykk" // TODO 测试链接
        // );
        // TODO 发送交易✔
        (async () => {
          if (!user.wallet.payInfo) return;

          try {
            let hash = "";
            if (user.wallet.walletType === "UNISAT" && uniSatRef.current) {
              hash = await uniSatRef.current._onSubmit(
                user.wallet.payInfo.cost,
                user.wallet.payInfo.toAddress
              );
            } else if (user.wallet.walletType === "OKX" && okxRef.current) {
              hash = await okxRef.current._onSubmit(
                user.wallet.payInfo.cost,
                user.wallet.payInfo.toAddress
              );
            }

            console.log("调起支付成功，得到：hash", hash);
            if (hash)
              dispatch(SET_PAY_INFO({ ...user.wallet.payInfo, hash: hash }));
          } catch (hash) {
            // TODO 用户取消支付✔
            // if (hash == "") CustomToast("user cancel payment");
            API_PAY_NODE_SMS(user.wallet.payInfo.orderNumber, "123456789", 2);
          }
        })();
        break;

      default:
        break;
    }

    return () => {};
  }, [user.wallet.notificationTriggerEvent, user.wallet.payInfo]);

  useImperativeHandle(ref, () => {
    return {
      _onSubmit(cost: number, toAddress: string) {
        if (user.wallet.walletType === "UNISAT" && uniSatRef.current) {
          return uniSatRef.current._onSubmit(cost, toAddress);
        } else if (user.wallet.walletType === "OKX" && okxRef.current) {
          return okxRef.current._onSubmit(cost, toAddress);
        }
        return new Promise((reslove) => reslove(""));
      },
      // _connect() {
      //   if (user.wallet.walletType === "UNISAT" && uniSatRef.current) {
      //     return uniSatRef.current._connect();
      //   } else if (user.wallet.walletType === "OKX" && okxRef.current) {
      //     return okxRef.current._connect();
      //   }
      // },
      _setWalletType(type: WalletType) {
        // setWalletType(type);
        dispatch(SET_WALLET_TYPE(type));
      },
      _selectWallet() {
        setOpen(true);
      },
    };
  });

  const okxwallet = window.okxwallet;
  const unisat = window.unisat;

  useEffect(() => {
    console.log("user", user);
  }, [user]);
  useEffect(() => {
    let timer = setInterval(async () => {
      if (unisat) {
        const [address] = await unisat.getAccounts();
        if (address) {
          clearInterval(timer);
          console.log("user is connected unisat!!");
          dispatch(SET_WALLET_TYPE("UNISAT"));

          return;
        }
      }

      if (okxwallet) {
        if (sessionStorage.getItem(sessionStorageKey.okx_address)) {
          clearInterval(timer);
          console.log("user is connected okx!!");
          dispatch(SET_WALLET_TYPE("OKX"));
          return;
        }
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // TODO 注册✔
  async function signUp(address: string, inviteCode: string) {
    await API_SIGNUP(address, inviteCode, publicKey);
  }

  // 签名并且登录
  async function signAndLogin(
    publicKey: string,
    address: string
  ): Promise<"LOGIN_SUCCESS" | undefined> {
    const message = `userAddressSignature:abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`;
    let sign;
    if (user.wallet.walletType == "OKX") {
      sign = await okxRef.current?._sign(address, message);
    } else {
      sign = await uniSatRef.current?._sign(address, message);
    }
    // TODO 暂时用不到sign
    // console.log("get sign:", sign);
    if (!address) return;

    // TODO MD5加密✔
    let signature = await API_GET_USER_SIGNATURE(address);
    const signStr = `${address}${signature.encryptedString}`;
    console.log("signStr", signStr);

    // TODO 登录✔
    let loginInfo = await API_LOGIN(address, Md5.hashStr(signStr), publicKey);

    if (loginInfo) {
      console.log(loginInfo);
      sessionStorage.setItem(
        sessionStorageKey.roos_token,
        `${address}::::${loginInfo.token}`
      );
      // TODO 用户登录,写入用户数据✔
      saveUserData(address);
      return "LOGIN_SUCCESS";
    }
  }

  // 检测token
  async function checkToken(
    address: string
  ): Promise<"CONFIRM_THE_INVITATION_CODE" | void> {
    const roos_token = sessionStorage.getItem(sessionStorageKey.roos_token);
    console.log("roos_token", roos_token);
    // TODO 判断是否有token，没有则签名请求获取token✔
    if (!roos_token || roos_token?.split("::::")[0] != address) {
      // TODO 判断用户是否注册✔

      // TODO 获取publickey 欧易app内无法获取？？？
      let pk = "";
      if (!isOKApp) {
        if (user.wallet.walletType == "OKX") {
          pk = await okxwallet?.bitcoin.getPublicKey();
          if (!pk) {
            CustomToast("get public key fail!");
            return;
          }
        }
        setPublicKey(pk);
      } else {
        // TODO app内写死key✔
        pk =
          "0305ef2a74bff2e2d68764c557ce2daecac92caa7a9406e3a90c2cf7c5b444a154";
      }

      if (!(await API_CHECT_EXIT(address))) {
        // TODO 获取页面连接的invite code，弹窗提示，默认测试：NODE123✔
        let urlInviteCode = getUrlQueryParam(UrlQueryParamsKey.INVITE_CODE);
        if (urlInviteCode) dispatch(SET_THIRD_INVITE_CODE(urlInviteCode));
        // TODO 弹窗提示输入邀请码✔
        setOpen(false);
        setInviteCodeDialogOpen(true);
        setInviteCode(urlInviteCode || "");
        return "CONFIRM_THE_INVITATION_CODE";
      }

      signAndLogin(pk, address);
    } else {
      // TODO 用户已经登录，直接保存数据✔
      saveUserData(address);
    }
  }

  // 连接钱包
  async function connectWallet(type: WalletType) {
    dispatch(SET_WALLET_TYPE(type));
    let address;
    if (type == "OKX") {
      if (!okxRef.current) return;
      address = await okxRef.current?._connect();
    } else if (type == "UNISAT") {
      if (!uniSatRef.current) return;
      address = await uniSatRef.current?._connect();
    }
    if (!address) return;
    // TODO 钱包连接完就保存地址✔
    sessionStorage.setItem(sessionStorageKey.okx_address, address);

    let res = await checkToken(address);

    if (res == "CONFIRM_THE_INVITATION_CODE") {
      return;
    }
  }

  // 用户切换
  async function handleAccountsChanged(address: string | undefined) {
    clearUserData();
    if (address) {
      // TODO 钱包切换完就保存地址✔
      sessionStorage.setItem(sessionStorageKey.okx_address, address);
      let res = await checkToken(address);
      if (res == "CONFIRM_THE_INVITATION_CODE") {
        return;
      }
    }
  }

  // 保存用户数据
  function saveUserData(address: string) {
    dispatch(SET_LOGINSTATUS("LOGIN"));
    dispatch(SET_CONNECTED(true));
    dispatch(SET_ADDRESS(address));
    // localStorage.setItem(localStorageKey.okx_address, address);
  }

  // 清空用户数据
  function clearUserData() {
    dispatch(SET_LOGINSTATUS("LOG_OUT"));
    dispatch(SET_CONNECTED(false));
    dispatch(SET_ADDRESS(""));
    sessionStorage.removeItem(sessionStorageKey.okx_address);
    sessionStorage.removeItem(sessionStorageKey.roos_token);
  }

  return (
    <>
      {/* 个人中心入口 */}
      {user.wallet.connected && (
        <button
          className="profile text-[#F58C00] uppercase z-[101]"
          onClick={() => {
            navigate("/profile");
          }}
        >
          MY JOURNEY
        </button>
      )}
      {/* 选择钱包弹窗 */}
      {!user.wallet.connected && (
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
          }}
        >
          <DialogTrigger asChild>
            <button
              className="ConnectWallet hover:bg-[#F58C00] hover:text-[#FFFFFF]"
              onClick={() => {
                setOpen(true);
              }}
            >
              CONNECT WALLET
            </button>
          </DialogTrigger>
          <DialogContent className="dialog-content">
            <div className="selectWallet w-full h-full">
              <div className="warpper_box w-full h-full border-solid border-[#F58C00] blur-[10px] absolute"></div>
              <div className="content_box flex flex-col items-center absolute w-full h-full  border-solid border-[#F58C00] bg-[#550935] opacity-80 ">
                <span className="font-[Raleway-Bold] text-[#F58C00] uppercase ">
                  Connect Wallet
                </span>
                <button
                  className="box-border border-solid border-[#EAEAEA] flex flex-row items-center hover:bg-[#F58C00] hover:border-[#F58C00]"
                  onClick={() => connectWallet("OKX")}
                >
                  <img className="" src={okx_logo} alt="" />
                  <span className="font-[Raleway-Bold]  text-[#fff]">OKX</span>
                </button>

                <button
                  className="box-border border-solid border-[#EAEAEA] flex flex-row items-center hover:bg-[#F58C00] hover:border-[#F58C00]"
                  onClick={() => connectWallet("UNISAT")}
                >
                  <img className="" src={unisat_logo} alt="" />
                  <span className="font-[Raleway-Bold]  text-[#fff]">
                    UNISAT
                  </span>
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* 连接钱包按钮 */}
      {user.wallet.connected && (
        <DropdownMenu>
          <DropdownMenuTrigger className="address" type="button">
            {" "}
            {user.wallet.address && shortenString(user.wallet.address, 6, 5)}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="DropdownMenuContent-disconnect flex items-center justify-center bg-[#000000]">
            <DropdownMenuItem>
              <button
                onClick={async () => {
                  if (user.wallet.walletType == "UNISAT") {
                    await uniSatRef.current?._disConnect();
                  } else if (user.wallet.walletType == "OKX") {
                    await okxRef.current?._disConnect();
                  }
                  clearUserData();
                }}
                className="disconnect flex items-center "
              >
                <IoMdExit className="exitIcon" />
                Disconnect
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {/* okx钱包占位 */}
      {user.wallet.walletType === "OKX" && (
        <UseOkx
          ref={okxRef}
          handleAccountsChanged={async (addressInfo) => {
            console.log("okx account change!", addressInfo);
            handleAccountsChanged(addressInfo?.address);
          }}
          checkInstalledOk={() => connectWallet("OKX")}
        />
      )}
      {/* unisat钱包占位 */}
      {user.wallet.walletType === "UNISAT" && (
        <UseUniSat
          ref={uniSatRef}
          handleAccountsChanged={async (accounts) => {
            console.log("unisat account change!", accounts[0]);
            handleAccountsChanged(accounts[0]);
          }}
          checkInstalledOk={() => connectWallet("UNISAT")}
        />
      )}

      {/* 输入邀请码弹窗 */}
      <Dialog
        open={inviteCodeDialogOpen}
        onOpenChange={(v) => {
          setInviteCodeDialogOpen(v);
        }}
      >
        <DialogContent className="dialog-content">
          <div className="inviteCode w-full h-full">
            <div className="warpper_box w-full h-full border-solid border-[#F58C00] blur-[10px] absolute"></div>
            <div className="content_box flex flex-col items-center absolute w-full h-full  border-solid border-[#F58C00] bg-[#550935] opacity-80 ">
              <span className="items-start">
                Please enter the invitation code
              </span>
              <ul className="flex items-center relative">
                {typeof inviteCode === "string" &&
                  fillArray(inviteCode.split(""), 6).map((v, i) => {
                    return (
                      <Fragment key={i}>
                        <li className="flex flex-col">
                          <span className="value">{v}</span>
                          <span className="line"></span>
                        </li>
                      </Fragment>
                    );
                  })}

                <input
                  value={inviteCode}
                  type="text"
                  className="absolute w-full h-full t-0 l-0 opacity-0"
                  onChange={(e) => {
                    setInviteCode(
                      e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6)
                    );
                  }}
                />
              </ul>
              <button
                className="confirm_btn"
                onClick={async () => {
                  //TODO 用户输入邀请码后登录✔
                  let address = sessionStorage.getItem(
                    sessionStorageKey.okx_address
                  );
                  try {
                    if (address) await signUp(address, inviteCode);
                  } catch (error) {
                    return;
                  }
                  if (address) {
                    let res = await signAndLogin(publicKey, address);
                    if (res == "LOGIN_SUCCESS") setInviteCodeDialogOpen(false);
                  }
                }}
              >
                Confirm binding
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

export default ConnectWallet;
