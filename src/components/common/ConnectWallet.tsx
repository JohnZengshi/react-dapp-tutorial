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

  useEffect(() => {
    let timer = setInterval(async () => {
      // console.log(window.okxwallet.bitcoin.selectedAccount);
      if (window.unisat) {
        const [address] = await window.unisat.getAccounts();
        // console.log(address);
        if (address) {
          clearInterval(timer);
          setWalletType(Wallet.UniSat);
        }
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <>
      {/* {connected && (
        <div>
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground">钱包信息：</p>
          <Separator className="my-4" />

          <div className="w-full flex h-5 items-center text-sm my-2">
            <div>Wallet Accounts: </div>
            <Separator className="mx-2" orientation="vertical" />
            <div className="ml-auto"> {address}</div>
          </div>
        </div>
      )} */}

      {!connected && (
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
          }}
        >
          <DialogTrigger asChild>
            <Button>Connect Wallet</Button>
          </DialogTrigger>
          <DialogContent>
            <RadioGroup
              onValueChange={(v: Wallet) => {
                console.log(`user choose ${v}`);
                setWalletType(v);
                if (v === Wallet.OKX) {
                  // okx_Connect();
                  console.log("connect?");

                  okxRef.current?._connect();
                } else if (v === Wallet.UniSat) {
                  // uniSat_Connect();
                  uniSatRef.current?._connect();
                }
                setOpen(false);
              }}
            >
              {/* <div className="flex items-center space-x-2">
                <RadioGroupItem value={Wallet.OKX} id={Wallet.OKX} />
                <Label htmlFor={Wallet.OKX}>OKX</Label>
              </div> */}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={Wallet.UniSat} id={Wallet.UniSat} />
                <Label htmlFor={Wallet.UniSat}>UniSat</Label>
              </div>
            </RadioGroup>
          </DialogContent>
        </Dialog>
      )}

      {connected && (
        // <Button
        //   onClick={() => {
        //     uniSatRef.current?._disConnect();
        //   }}
        // >
        //   {/* Disconnect Wallet */}
        //   {address && shortenString(address, 6, 5)}
        // </Button>

        <DropdownMenu>
          <DropdownMenuTrigger type="button">
            {" "}
            {address && shortenString(address, 6, 5)}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                uniSatRef.current?._disConnect();
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
