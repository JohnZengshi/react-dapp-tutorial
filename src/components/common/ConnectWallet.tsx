import { Button, ButtonProps } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import UseOkx, { Okx_HandleType } from "@/wallet/Okx";
import { Separator } from "@/components/ui/separator";
import UseUniSat, { UniSat_handleType } from "@/wallet/UniSat";
import { shortenString } from "@/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import "./ConnectWallet.scss";
import "./ConnectWallet-m.scss";
/*
 * @LastEditors: John
 * @Date: 2024-01-02 14:40:57
 * @LastEditTime: 2024-01-03 14:29:20
 * @Author: John
 */
export type ConnectWallet_handleType = {
  _onSubmit: (cost: number, toAddress: string) => Promise<boolean>;
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
  enum Wallet {
    OKX = "OKX",
    UniSat = "UniSat",
  }
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
        return new Promise((reslove) => reslove(false));
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
        const account = okxwallet.bitcoin.selecteaAccount;
        console.log("selected account:", account);
        if (account) {
          clearInterval(timer);
          console.log("user is connected okx!!");
          setWalletType(Wallet.OKX);

          return;
        }
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
          open={false}
          onOpenChange={(v) => {
            setOpen(v);
          }}
        >
          <DialogTrigger asChild>
            <button
              className="ConnectWallet"
              // TODO 暂时连接okx
              onClick={() => {
                setWalletType(Wallet.OKX);
                okxRef.current?._connect();
              }}
            >
              CONNECT WALLET
            </button>
          </DialogTrigger>
          <DialogContent className="connectWalletDoalogContent">
            <Button
              onClick={() => {
                setWalletType(Wallet.OKX);
                okxRef.current?._connect();
              }}
            >
              OKX
            </Button>

            <Button
              onClick={() => {
                setWalletType(Wallet.UniSat);
                uniSatRef.current?._connect();
              }}
            >
              UniSat
            </Button>
            {/* <RadioGroup
              onValueChange={(v: Wallet) => {
                console.log(`user choose ${v}`);
                setWalletType(v);
                if (v === Wallet.OKX) {
                  // okx_Connect();
                  // console.log("connect?");
                  okxRef.current?._connect();
                } else if (v === Wallet.UniSat) {
                  // uniSat_Connect();
                  uniSatRef.current?._connect();
                }
                setOpen(false);
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={Wallet.OKX} id={Wallet.OKX} />
                <Label htmlFor={Wallet.OKX}>OKX</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={Wallet.UniSat} id={Wallet.UniSat} />
                <Label htmlFor={Wallet.UniSat}>UniSat</Label>
              </div>
            </RadioGroup> */}
          </DialogContent>
        </Dialog>
      )}

      {connected && (
        <DropdownMenu>
          <DropdownMenuTrigger className="address" type="button">
            {" "}
            {address && shortenString(address, 6, 5)}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
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
          </DropdownMenuContent>
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
