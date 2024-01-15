import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
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
import { Wallet, fillArray, localStorageKey, shortenString } from "@/utils";
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
  SET_NOTIFICATION_TRIGGER_EVENT,
  SET_PAY_INFO,
  SET_WALLET_INSTALL,
  SET_WALLET_TYPE,
  UserState,
} from "@/store/reducer";
import { useNavigate } from "react-router-dom";
import { IoMdExit } from "react-icons/io";
import CustomToast from "./CustomToast";
import { API_PAY_NODE_SMS } from "@/utils/api";
/*
 * @LastEditors: John
 * @Date: 2024-01-02 14:40:57
 * @LastEditTime: 2024-01-03 14:29:20
 * @Author: John
 */
type WalletType = UserState["wallet"]["walletType"];
export type ConnectWallet_handleType = {
  _onSubmit: (cost: number, toAddress: string) => Promise<string>;
  _connect: () => void;
  _setWalletType: (type: WalletType) => void;
  _selectWallet: () => void;
};
const ConnectWallet = forwardRef<
  ConnectWallet_handleType,
  {
    onUpdate: (
      installed: boolean,
      connected: boolean,
      address: string | undefined
    ) => void;
  }
>(function (props, ref) {
  const [open, setOpen] = useState(false);

  // const [walletType, setWalletType] = useState<Wallet | "">("");

  const okxRef = useRef<Okx_HandleType>(null);
  const uniSatRef = useRef<UniSat_handleType>(null);

  // const [installed, setInstalled] = useState(false);
  // const [connected, setConnected] = useState(false);
  // const [address, setAddress] = useState<string>();

  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [inviteCode, setInviteCode] = useState<string>("");

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
          } catch (error) {
            // TODO 用户取消支付
            CustomToast("user cancel payment");
            API_PAY_NODE_SMS(user.wallet.payInfo.orderNumber, "123456789", 2);
          }
        })();
        break;

      default:
        break;
    }

    return () => {};
  }, [user.wallet.notificationTriggerEvent, user.wallet.payInfo]);

  useEffect(() => {
    // setDialogOpen(true);

    return () => {};
  }, []);

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
      _connect() {
        if (user.wallet.walletType === "UNISAT" && uniSatRef.current) {
          return uniSatRef.current._connect();
        } else if (user.wallet.walletType === "OKX" && okxRef.current) {
          return okxRef.current._connect();
        }
      },
      _setWalletType(type: WalletType) {
        // setWalletType(type);
        dispatch(SET_WALLET_TYPE(type));
      },
      _selectWallet() {
        setOpen(true);
      },
    };
  });

  function onUpdate(i: boolean, c: boolean, a: string | undefined) {
    dispatch(SET_ADDRESS(a));
    dispatch(SET_CONNECTED(c));
    dispatch(SET_WALLET_INSTALL(i));
    // setInstalled(i);
    // setConnected(c);
    // setAddress(a);

    props.onUpdate(i, c, a);
  }

  const okxwallet = window.okxwallet;

  useEffect(() => {
    console.log("user", user);
  }, [user]);
  useEffect(() => {
    let timer = setInterval(async () => {
      // console.log(okxwallet.bitcoin.selectedAccount);
      // console.log(window.unisat);
      if (window.unisat) {
        const [address] = await window.unisat.getAccounts();
        // console.log(address);
        if (address) {
          clearInterval(timer);
          console.log("user is connected unisat!!");
          // setWalletType(Wallet.UniSat);
          dispatch(SET_WALLET_TYPE("UNISAT"));

          return;
        }
      }

      // console.log("okxwallet", okxwallet);
      if (okxwallet) {
        if (localStorage.getItem(localStorageKey.okx_address)) {
          clearInterval(timer);
          console.log("user is connected okx!!");
          // setWalletType(Wallet.OKX);
          dispatch(SET_WALLET_TYPE("OKX"));
          return;
        }
        // const account = okxwallet.bitcoin.selecteaAccount;
        // console.log("selected account:", account);
        // if (account) {
        //   clearInterval(timer);
        //   console.log("user is connected okx!!");
        //   setWalletType(Wallet.OKX);
        //   return;
        // }
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <>
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
                  onClick={() => {
                    // setWalletType(Wallet.OKX);
                    dispatch(SET_WALLET_TYPE("OKX"));
                    okxRef.current?._connect();
                  }}
                >
                  <img className="" src={okx_logo} alt="" />
                  <span className="font-[Raleway-Bold]  text-[#fff]">OKX</span>
                </button>

                {/* <button
                  className="box-border border-solid border-[#EAEAEA] flex flex-row items-center hover:bg-[#F58C00] hover:border-[#F58C00]"
                  onClick={() => {
                    // setWalletType(Wallet.UniSat);
                    dispatch(SET_WALLET_TYPE("UNISAT"));
                    uniSatRef.current?._connect();
                  }}
                >
                  <img className="" src={unisat_logo} alt="" />
                  <span className="font-[Raleway-Bold]  text-[#fff]">
                    UniSat
                  </span>
                </button> */}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {user.wallet.connected && (
        <DropdownMenu>
          <DropdownMenuTrigger className="address" type="button">
            {" "}
            {user.wallet.address && shortenString(user.wallet.address, 6, 5)}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="DropdownMenuContent-disconnect flex items-center justify-center">
            <DropdownMenuItem>
              <button
                onClick={() => {
                  if (user.wallet.walletType == "UNISAT") {
                    uniSatRef.current?._disConnect();
                  } else if (user.wallet.walletType == "OKX") {
                    okxRef.current?._disConnect();
                  }
                }}
                className="disconnect flex items-center"
              >
                <IoMdExit className="exitIcon" />
                Disconnect
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {user.wallet.walletType === "OKX" && (
        <UseOkx
          ref={okxRef}
          onUpdate={(i, c, a) => {
            onUpdate(i, c, a);
          }}
          shouldIputInviteCode={(code) => {
            setOpen(false);
            setDialogOpen(true);
            setInviteCode(code || "");
          }}
          checkInputInviteCodeOk={() => setDialogOpen(false)}
        />
      )}
      {user.wallet.walletType === "UNISAT" && (
        <UseUniSat
          ref={uniSatRef}
          onUpdate={(i, c, a) => {
            onUpdate(i, c, a);
          }}
        />
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(v) => {
          setDialogOpen(v);
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

                {/* <li className="flex flex-col">
                  <span className="value">8</span>
                  <span className="line"></span>
                </li>
                <li className="flex flex-col">
                  <span className="value hidden">8</span>
                  <span className="line"></span>
                </li>
                <li className="flex flex-col">
                  <span className="value hidden">8</span>
                  <span className="line"></span>
                </li>
                <li className="flex flex-col">
                  <span className="value hidden">8</span>
                  <span className="line"></span>
                </li>
                <li className="flex flex-col">
                  <span className="value hidden">8</span>
                  <span className="line"></span>
                </li> */}
              </ul>
              <button
                className="confirm_btn"
                onClick={() => {
                  okxRef.current?._comfireBinding(inviteCode);
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
