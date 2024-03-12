/*
 * @LastEditors: John
 * @Date: 2024-03-08 09:44:08
 * @LastEditTime: 2024-03-12 09:58:23
 * @Author: John
 */
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Fragment,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Okx_HandleType } from "@/wallet/Okx";
import { UniSat_handleType } from "@/wallet/UniSat";
import {
  UrlQueryParamsKey,
  fillArray,
  getUrlQueryParam,
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
  ChainType,
  SET_ADDRESS,
  SET_BUY_LOADING,
  // SET_CHAIN_TYPE,
  SET_CONNECTED,
  SET_LOGINSTATUS,
  SET_NOTIFICATION_TRIGGER_EVENT,
  SET_PAY_INFO,
  SET_THIRD_INVITE_CODE,
  // SET_WALLET_TYPE,
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
  API_BIND_OR_NOT,
  API_BINDING_RELATIONSHIP,
} from "@/utils/api";
import { Md5 } from "ts-md5";
import CustomDialogContent from "./CustomDialogContent";
import { MetaMask_HandleType } from "@/wallet/MetaMask";
import copy from "@/assets/copy.png";
import * as clipboard from "clipboard-polyfill";
import IconFont from "../iconfont";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import {
  useAccount,
  useBlockNumber,
  useDisconnect,
  useSignMessage,
} from "wagmi";
import { getWalletClient } from "@wagmi/core";
import { TYPE_ADDRESS } from "@/types";
import { config } from "../WalletProvider";
import { subimtByContract } from "@/utils/walletApi";

export type ConnectWallet_handleType = {
  // _onSubmit: (cost: number, toAddress: string) => Promise<string>;
  // _setWalletType: (type: WalletType) => void;
  _selectWallet: () => void;
};
const ConnectWallet = forwardRef<ConnectWallet_handleType, {}>(function (
  props,
  ref
) {
  const { open, close } = useWeb3Modal();
  const { address, addresses, isConnected } = useAccount();
  const { signMessage, signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const { data, error } = useBlockNumber();

  const [selectWalletOpen, setSelectWalletOpen] = useState(false);
  const [connectWalletType, setConnectWalletType] = useState<
    "MULTI_CHAIN" | "SINGLE"
  >("MULTI_CHAIN");

  const okxRef = useRef<Okx_HandleType>(null);
  const uniSatRef = useRef<UniSat_handleType>(null);
  const metaMaskRef = useRef<MetaMask_HandleType>(null);
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
        setConnectWalletType("MULTI_CHAIN");
        // setSelectWalletOpen(true);
        open();

        break;
      case "CONNECT": // 连接
        dispatch(SET_NOTIFICATION_TRIGGER_EVENT(""));

        break;
      case "TRANSACTION": // 发送交易
        dispatch(SET_NOTIFICATION_TRIGGER_EVENT(""));
        // TODO 发送交易✔
        (async () => {
          if (!user.wallet.payInfo) return;

          try {
            dispatch(SET_BUY_LOADING(true));
            let hash = "";
            // TODO 重写发送交易✔
            // if (user.wallet.walletType === "UNISAT" && uniSatRef.current) {
            //   hash = await uniSatRef.current._onSubmit(
            //     user.wallet.payInfo.buyCount,
            //     user.wallet.payInfo.toAddress
            //   );
            // } else if (user.wallet.walletType === "OKX" && okxRef.current) {
            //   hash = await okxRef.current._onSubmit(
            //     user.wallet.payInfo.buyAmount,
            //     user.wallet.payInfo.buyCount,
            //     user.wallet.payInfo.num,
            //     user.wallet.payInfo.rebateRatio,
            //     user.wallet.payInfo.address,
            //     user.wallet.payInfo.toAddress
            //   );
            // } else if (
            //   user.wallet.walletType === "MetaMask" &&
            //   metaMaskRef.current
            // ) {
            //   hash = await metaMaskRef.current._onSubmit(
            //     user.wallet.payInfo.buyAmount,
            //     user.wallet.payInfo.buyCount,
            //     user.wallet.payInfo.num,
            //     user.wallet.payInfo.rebateRatio,
            //     user.wallet.payInfo.address
            //   );
            // }
            const provider = await getWalletClient(config);

            hash = await subimtByContract(
              BigInt(user.wallet.payInfo.buyAmount),
              user.wallet.payInfo.buyCount,
              user.wallet.payInfo.num,
              user.wallet.payInfo.rebateRatio,
              user.wallet.payInfo.address,
              provider,
              user.wallet.address
            );

            console.log("调起支付成功，得到：hash", hash);
            if (hash)
              dispatch(SET_PAY_INFO({ ...user.wallet.payInfo, hash: hash }));
          } catch (err) {
            console.log("用户取消支付:", err);
            dispatch(SET_BUY_LOADING(false));
            // TODO 用户取消支付✔
            // if (hash == "") CustomToast("user cancel payment");
            // CustomToast("cancel payment");
            await API_PAY_NODE_SMS(
              user.wallet.payInfo.orderNumber,
              "123456789",
              2
            );
            dispatch(SET_PAY_INFO(null));
          }
        })();
        break;

      case "SELECT_WALLET_MULTI_CHAIN": // 选择钱包（多链）
        dispatch(SET_NOTIFICATION_TRIGGER_EVENT(""));
        setConnectWalletType("MULTI_CHAIN");
        // setSelectWalletOpen(true);
        open();
        break;

      default:
        break;
    }

    return () => {};
  }, [user.wallet.notificationTriggerEvent, user.wallet.payInfo]);

  useImperativeHandle(ref, () => {
    return {
      // _setWalletType(type: WalletType) {
      //   // setWalletType(type);
      //   dispatch(SET_WALLET_TYPE(type));
      // },
      _selectWallet() {
        setConnectWalletType("MULTI_CHAIN");
        // setSelectWalletOpen(true);
        open();
      },
    };
  });

  const okxwallet = window.okxwallet;
  const unisat = window.unisat;

  useEffect(() => {}, [user]);

  // 检测上次链接的钱包（废弃）
  // useEffect(() => {
  //   let timer = setInterval(async () => {
  //     if (unisat) {
  //       const [address] = await unisat.getAccounts();
  //       if (address) {
  //         clearInterval(timer);
  //         console.log("user is connected unisat!!");
  //         dispatch(SET_WALLET_TYPE("UNISAT"));

  //         return;
  //       }
  //     }

  //     if (okxwallet) {
  //       if (sessionStorage.getItem(sessionStorageKey.okx_address)) {
  //         clearInterval(timer);
  //         console.log("user is connected okx!!");
  //         dispatch(SET_WALLET_TYPE("OKX"));
  //         return;
  //       }
  //     }

  //     const metaMask = await detectEthereumProvider();
  //     if (metaMask) {
  //       if (sessionStorage.getItem(sessionStorageKey.metaMask_address)) {
  //         clearInterval(timer);
  //         console.log("user is connected metaMask!!");
  //         dispatch(SET_WALLET_TYPE("MetaMask"));
  //         return;
  //       }
  //     }
  //   }, 1000);

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  useEffect(() => {
    const lowerAddress = address?.toLocaleLowerCase();
    if (lowerAddress) handleAccountsChanged(lowerAddress as TYPE_ADDRESS);
  }, [address]);

  useEffect(() => {
    console.log("error:", error);

    return () => {};
  }, [error]);

  // TODO 注册✔
  async function signUp(
    address: TYPE_ADDRESS,
    inviteCode: string,
    publicKey: string
  ) {
    await API_SIGNUP(address, inviteCode, publicKey);
  }

  // 签名并且登录
  async function signAndLogin(
    publicKey: string,
    address: TYPE_ADDRESS
  ): Promise<"LOGIN_SUCCESS" | undefined> {
    const message = `userAddressSignature:abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`;
    let sign: string | undefined;
    // TODO 重写sign签名 ✔
    // if (user.wallet.walletType == "OKX") {
    //   sign = await okxRef.current?._sign(address, message);
    // } else if (user.wallet.walletType == "UNISAT") {
    //   sign = await uniSatRef.current?._sign(address, message);
    // } else if (user.wallet.walletType == "MetaMask") {
    //   sign = await metaMaskRef.current?._sign(address, message);
    // }
    sign = await signMessageAsync({ message });
    // 暂时用不到sign
    // console.log("get sign:", sign);
    if (!address) return;

    // TODO MD5加密✔
    let signature = await API_GET_USER_SIGNATURE(address);
    const signStr = `${address}${signature.encryptedString}`;
    console.log("signStr", signStr);

    // TODO 登录✔
    let loginInfo = await API_LOGIN(
      address,
      Md5.hashStr(signStr),
      publicKey
      // user.wallet.chainType
    );

    if (loginInfo) {
      console.log(loginInfo);
      sessionStorage.setItem(
        sessionStorageKey.roos_token,
        `${address}::::${loginInfo.token}`
      );
      // TODO 用户登录,写入用户数据✔
      saveUserData(address);

      // TODO 判断用户是否绑定关系✔
      await checkUserBind();

      return "LOGIN_SUCCESS";
    }
  }

  // 检测token
  async function checkToken(address: TYPE_ADDRESS): Promise<void> {
    const roos_token = sessionStorage.getItem(sessionStorageKey.roos_token);
    console.log("roos_token", roos_token);
    // TODO 判断是否有token，没有则签名请求获取token✔
    if (!roos_token || roos_token?.split("::::")[0] != address) {
      // TODO 判断用户是否注册✔

      // TODO 获取publickey 欧易app内无法获取？？？
      let pk = "";
      // if (
      //   !isOKApp &&
      //   user.wallet.walletType == "OKX" &&
      //   user.wallet.chainType == "BTC"
      // ) {
      //   pk = await okxwallet?.bitcoin.getPublicKey();
      //   if (!pk) {
      //     CustomToast("get public key fail!");
      //     return;
      //   }
      //   setPublicKey(pk);
      // } else {
      // TODO app内写死key✔
      pk = "0305ef2a74bff2e2d68764c557ce2daecac92caa7a9406e3a90c2cf7c5b444a154";
      // }

      if (!(await API_CHECT_EXIT(address))) {
        // TODO 邀请码未强制要求绑定✔
        await signUp(address, inviteCode, pk);
      }

      await signAndLogin(pk, address);
    } else {
      // TODO 用户已经登录，直接保存数据✔
      saveUserData(address);
    }
  }

  // 连接钱包（废弃）
  async function connectWallet(type: WalletType, chain: ChainType) {
    console.log("chain check", chain);
    // dispatch(SET_WALLET_TYPE(type));
    // dispatch(SET_CHAIN_TYPE(chain));
    let address;
    if (type == "OKX") {
      if (!okxRef.current) return;
      address = await okxRef.current?._connect(chain);
    } else if (type == "UNISAT") {
      if (!uniSatRef.current) return;
      address = await uniSatRef.current?._connect();
    } else if (type == "MetaMask") {
      if (!metaMaskRef.current) return;
      address = await metaMaskRef.current?._connect(chain);
    }
    if (!address) return;
    // TODO 钱包连接完就保存地址✔
    // if (user.wallet.walletType == "OKX")
    //   sessionStorage.setItem(sessionStorageKey.okx_address, address);
    // if (user.wallet.walletType == "UNISAT")
    //   sessionStorage.setItem(sessionStorageKey.unisat_address, address);
    // if (user.wallet.walletType == "MetaMask")
    //   sessionStorage.setItem(sessionStorageKey.metaMask_address, address);
    sessionStorage.setItem(sessionStorageKey.wallet_address, address);
    await checkToken(address);
  }

  // 用户切换
  async function handleAccountsChanged(address: TYPE_ADDRESS) {
    clearUserData();
    if (address) {
      // TODO 钱包切换完就保存地址✔
      sessionStorage.setItem(sessionStorageKey.wallet_address, address);
      // if (user.wallet.walletType == "OKX")
      //   sessionStorage.setItem(sessionStorageKey.okx_address, address);
      // if (user.wallet.walletType == "UNISAT")
      //   sessionStorage.setItem(sessionStorageKey.unisat_address, address);
      // if (user.wallet.walletType == "MetaMask")
      //   sessionStorage.setItem(sessionStorageKey.metaMask_address, address);
      await checkToken(address);
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
    dispatch(SET_BUY_LOADING(false));
    // TODO 清空用户保存的地址✔
    // sessionStorage.removeItem(sessionStorageKey.okx_address);
    // sessionStorage.removeItem(sessionStorageKey.unisat_address);
    // sessionStorage.removeItem(sessionStorageKey.metaMask_address);
    sessionStorage.removeItem(sessionStorageKey.wallet_address);
    sessionStorage.removeItem(sessionStorageKey.roos_token);
  }

  async function checkUserBind() {
    if (!(await API_BIND_OR_NOT())) {
      // TODO 获取页面连接的invite code，弹窗提示，默认测试：NODE123✔
      let urlInviteCode = getUrlQueryParam(UrlQueryParamsKey.INVITE_CODE);
      if (urlInviteCode) dispatch(SET_THIRD_INVITE_CODE(urlInviteCode));
      // TODO 弹窗提示输入邀请码✔
      setSelectWalletOpen(false);
      setInviteCodeDialogOpen(true);
      setInviteCode(urlInviteCode || "");
      return;
    }

    CustomToast("User has been bound!");
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
          // open={selectWalletOpen}
          open={false}
          onOpenChange={(v) => {
            setSelectWalletOpen(v);
          }}
        >
          <DialogTrigger asChild>
            <button
              className="ConnectWallet hover:bg-[#F58C00] hover:text-[#FFFFFF]"
              onClick={() => {
                setConnectWalletType("MULTI_CHAIN");
                // setSelectWalletOpen(true);
                open();
              }}
            >
              CONNECT WALLET
            </button>
          </DialogTrigger>
          <CustomDialogContent>
            <div className="selectWallet flex justify-center flex-col">
              <span className="font-[Raleway-Bold] text-[#F58C00] uppercase ">
                Connect Wallet
              </span>

              {connectWalletType == "MULTI_CHAIN" && (
                <>
                  {/* Arbitrum One */}
                  <span className="chainTitle flex flex-row items-center">
                    <span className="point"></span> Ethereum Wallet
                  </span>

                  <button
                    className="box-border border-solid border-[#EAEAEA] flex flex-row items-center hover:bg-[#F58C00] hover:border-[#F58C00]"
                    onClick={() => connectWallet("OKX", "Arbitrum One")}
                  >
                    <img className="" src={okx_logo} alt="" />
                    <span className="font-[Raleway-Bold]  text-[#fff]">
                      OKX
                    </span>
                  </button>

                  {/* Arbitrum Test */}
                  {import.meta.env.MODE != "production" && (
                    <>
                      <span className="chainTitle flex flex-row items-center">
                        <span className="point"></span> Arbitrum Testnet
                      </span>

                      <button
                        className="box-border border-solid border-[#EAEAEA] flex flex-row items-center hover:bg-[#F58C00] hover:border-[#F58C00]"
                        onClick={() => connectWallet("OKX", "Arbitrum test")}
                      >
                        <img className="" src={okx_logo} alt="" />
                        <span className="font-[Raleway-Bold]  text-[#fff]">
                          OKX
                        </span>
                      </button>

                      <button
                        className="box-border border-solid border-[#EAEAEA] flex flex-row items-center hover:bg-[#F58C00] hover:border-[#F58C00]"
                        onClick={() =>
                          connectWallet("MetaMask", "Arbitrum test")
                        }
                      >
                        <IconFont className="walletIcon" name="metamask" />
                        <span className="font-[Raleway-Bold]  text-[#fff]">
                          MetaMask
                        </span>
                      </button>
                    </>
                  )}
                </>
              )}

              <span className="chainTitle flex flex-row items-center">
                <span className="point"></span> Bitcoin Wallet
              </span>
              <button
                className="box-border border-solid border-[#EAEAEA] flex flex-row items-center hover:bg-[#F58C00] hover:border-[#F58C00]"
                onClick={() => connectWallet("OKX", "BTC")}
              >
                <img className="" src={okx_logo} alt="" />
                <span className="font-[Raleway-Bold]  text-[#fff]">OKX</span>
              </button>

              <button
                className="box-border border-solid border-[#EAEAEA] flex flex-row items-center hover:bg-[#F58C00] hover:border-[#F58C00]"
                onClick={() => connectWallet("UNISAT", "BTC")}
              >
                <img className="" src={unisat_logo} alt="" />
                <span className="font-[Raleway-Bold]  text-[#fff]">UNISAT</span>
              </button>
            </div>
          </CustomDialogContent>
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
                  if (user.wallet.address) {
                    clipboard.writeText(user.wallet.address);
                    CustomToast("Copy Success");
                  }
                }}
                className="item flex items-center "
              >
                {user.wallet.address &&
                  shortenString(user.wallet.address, 6, 5)}
                <img className="copy" src={copy} alt="" />
              </button>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <button
                onClick={async () => {
                  await checkUserBind();
                }}
                className="item flex items-center "
              >
                Enter Referral Code
              </button>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <button
                onClick={async () => {
                  CustomToast("Coming soog");
                }}
                className="item flex items-center "
              >
                ROOS Testnet Faucet
              </button>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <button
                onClick={async () => {
                  // if (user.wallet.walletType == "UNISAT") {
                  //   await uniSatRef.current?._disConnect();
                  // } else if (user.wallet.walletType == "OKX") {
                  //   await okxRef.current?._disConnect();
                  // }
                  // TODO 处理断开链接✔
                  disconnect();
                  clearUserData();
                }}
                className="item disconnect flex items-center "
              >
                <IoMdExit className="exitIcon" />
                Disconnect
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {/* okx钱包占位(废弃) */}
      {/* {user.wallet.walletType === "OKX" && (
        <UseOkx
          ref={okxRef}
          handleAccountsChanged={async (addressInfo) => {
            console.log("okx account change!", addressInfo);
            handleAccountsChanged(addressInfo?.address);
          }}
          checkInstalledOk={() => connectWallet("OKX", user.wallet.chainType)}
        />
      )} */}
      {/* unisat钱包占位(废弃) */}
      {/* {user.wallet.walletType === "UNISAT" && (
        <UseUniSat
          ref={uniSatRef}
          handleAccountsChanged={async (accounts) => {
            console.log("unisat account change!", accounts[0]);
            handleAccountsChanged(accounts[0]);
          }}
          checkInstalledOk={() =>
            connectWallet("UNISAT", user.wallet.chainType)
          }
        />
      )} */}
      {/* MetaMask钱包占位(废弃) */}
      {/* {user.wallet.walletType === "MetaMask" && (
        <MetaMask
          ref={metaMaskRef}
          handleAccountsChanged={async (accounts) => {
            console.log("MetaMask account change!", accounts);
            handleAccountsChanged(accounts);
          }}
          checkInstalledOk={() =>
            connectWallet("MetaMask", user.wallet.chainType)
          }
        />
      )} */}
      {/* 输入邀请码弹窗 */}
      <Dialog
        open={inviteCodeDialogOpen}
        onOpenChange={(v) => {
          setInviteCodeDialogOpen(v);
        }}
      >
        <CustomDialogContent>
          <div className="inviteCode flex justify-center flex-col items-center">
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
                //TODO 用户绑定邀请码✔
                let res = await API_BINDING_RELATIONSHIP(inviteCode);
                if (res.data.result) {
                  setInviteCodeDialogOpen(false);
                  CustomToast(res.msg);
                }
              }}
            >
              Confirm binding
            </button>
          </div>
        </CustomDialogContent>
      </Dialog>
    </>
  );
});

export default ConnectWallet;
