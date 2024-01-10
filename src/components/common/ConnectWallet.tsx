import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import UseOkx, { Okx_HandleType } from "@/wallet/Okx";
import UseUniSat, { UniSat_handleType } from "@/wallet/UniSat";
import { Wallet, localStorageKey, shortenString } from "@/utils";
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
/*
 * @LastEditors: John
 * @Date: 2024-01-02 14:40:57
 * @LastEditTime: 2024-01-03 14:29:20
 * @Author: John
 */

export type ConnectWallet_handleType = {
  _onSubmit: (cost: number, toAddress: string) => Promise<string>;
  _connect: () => void;
  _setWalletType: (type: Wallet) => void;
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

  const [walletType, setWalletType] = useState<Wallet | "">("");

  const okxRef = useRef<Okx_HandleType>(null);
  const uniSatRef = useRef<UniSat_handleType>(null);

  const [installed, setInstalled] = useState(false);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string>();

  useImperativeHandle(ref, () => {
    return {
      _onSubmit(cost: number, toAddress: string) {
        if (walletType === Wallet.UniSat && uniSatRef.current) {
          return uniSatRef.current._onSubmit(cost, toAddress);
        } else if (walletType === Wallet.OKX && okxRef.current) {
          return okxRef.current._onSubmit(cost, toAddress);
        }
        return new Promise((reslove) => reslove(""));
      },
      _connect() {
        if (walletType === Wallet.UniSat && uniSatRef.current) {
          return uniSatRef.current._connect();
        } else if (walletType === Wallet.OKX && okxRef.current) {
          return okxRef.current._connect();
        }
      },
      _setWalletType(type) {
        setWalletType(type);
      },
      _selectWallet() {
        setOpen(true);
      },
    };
  });

  function onUpdate(i: boolean, c: boolean, a: string | undefined) {
    setInstalled(i);
    setConnected(c);
    setAddress(a);

    props.onUpdate(i, c, a);
  }

  const okxwallet = window.okxwallet;
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
          setWalletType(Wallet.UniSat);

          return;
        }
      }

      // console.log("okxwallet", okxwallet);
      if (okxwallet) {
        if (localStorage.getItem(localStorageKey.okx_address)) {
          clearInterval(timer);
          console.log("user is connected okx!!");
          setWalletType(Wallet.OKX);
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
      {!connected && (
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
          }}
        >
          <DialogTrigger asChild>
            <button
              className="ConnectWallet"
              onClick={() => {
                setOpen(true);
              }}
            >
              CONNECT WALLET
            </button>
          </DialogTrigger>
          <DialogContent className="w-[512px] h-[310px]">
            <div className="w-full h-full border-[4px] border-solid border-[#F58C00] blur-[10px] absolute"></div>
            <div className="flex flex-col items-center absolute w-full h-full border-[1px] border-solid border-[#F58C00] bg-[#550935] opacity-80 rounded-[5px]">
              <span className="text-[34px] font-[Raleway-Bold] text-[#F58C00] uppercase mt-[42px]">
                Connect Wallet
              </span>
              <button
                className="w-[307px] h-[45px] rounded-[3.55px] box-border border-[0.71px] border-solid border-[#EAEAEA] flex flex-row items-center mt-[65px] hover:bg-[#F58C00] hover:border-[#F58C00]"
                onClick={() => {
                  setWalletType(Wallet.OKX);
                  okxRef.current?._connect();
                }}
              >
                <img
                  className="w-[27px] h-[27px] mr-[11.25px] ml-[24px]"
                  src={okx_logo}
                  alt=""
                />
                <span className="font-[Raleway-Bold] text-[19.13px] text-[#fff]">
                  OKX
                </span>
              </button>

              <button
                className="w-[307px] h-[45px] rounded-[3.55px] box-border border-[0.71px] border-solid border-[#EAEAEA] flex flex-row items-center mt-[22.5px] hover:bg-[#F58C00] hover:border-[#F58C00]"
                onClick={() => {
                  setWalletType(Wallet.UniSat);
                  uniSatRef.current?._connect();
                }}
              >
                <img
                  className="w-[27px] h-[27px] mr-[11.25px] ml-[24px]"
                  src={unisat_logo}
                  alt=""
                />
                <span className="font-[Raleway-Bold] text-[19.13px] text-[#fff]">
                  UniSat
                </span>
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {connected && (
        <DropdownMenu>
          <DropdownMenuTrigger className="address" type="button">
            {" "}
            {address && shortenString(address, 6, 5)}
          </DropdownMenuTrigger>
          {/* <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                if (walletType == Wallet.UniSat) {
                  uniSatRef.current?._disConnect();
                } else if (walletType == Wallet.OKX) {
                  okxRef.current?._disConnect();
                }
              }}
            >
              Disconnect Wallet
            </DropdownMenuItem>
          </DropdownMenuContent> */}
        </DropdownMenu>
      )}

      {walletType === Wallet.OKX && (
        <UseOkx
          ref={okxRef}
          onUpdate={(i, c, a) => {
            onUpdate(i, c, a);
          }}
        />
      )}
      {walletType === Wallet.UniSat && (
        <UseUniSat
          ref={uniSatRef}
          onUpdate={(i, c, a) => {
            onUpdate(i, c, a);
          }}
        />
      )}
    </>
  );
});

export default ConnectWallet;
