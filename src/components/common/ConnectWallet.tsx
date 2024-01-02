import { Button, ButtonProps } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import UseOkx from "@/wallet/UseOkx";
import { Separator } from "@/components/ui/separator";
import UseUniSat from "@/wallet/UseUniSat";
/*
 * @LastEditors: John
 * @Date: 2024-01-02 14:40:57
 * @LastEditTime: 2024-01-02 17:50:55
 * @Author: John
 */
export default function ConnectWallet(props: ButtonProps) {
  const [open, setOpen] = useState(false);
  enum Wallet {
    OKX = "OKX",
    UniSat = "UniSat",
  }
  let {
    connect: okx_Connect,
    disConnect: okx_DisConnect,
    address: okx_Address,
    connected: okx_Connected,
  } = UseOkx();
  let {
    connect: uniSat_Connect,

    connected: uniSat_Connected,
    address: uniSat_Address,
  } = UseUniSat();

  return (
    <>
      {okx_Connected && (
        <div>
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground">钱包信息：</p>
          <Separator className="my-4" />

          <div className="w-full flex h-5 items-center text-sm my-2">
            <div>Wallet Accounts: </div>
            <Separator className="mx-2" orientation="vertical" />
            <div className="ml-auto"> {okx_Address}</div>
          </div>

          <Button
            onClick={() => {
              okx_DisConnect();
            }}
          >
            disConnect Wallet
          </Button>
        </div>
      )}

      {uniSat_Connected && (
        <div>
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground">钱包信息：</p>
          <Separator className="my-4" />

          <div className="w-full flex h-5 items-center text-sm my-2">
            <div>Wallet Accounts: </div>
            <Separator className="mx-2" orientation="vertical" />
            <div className="ml-auto"> {uniSat_Address}</div>
          </div>

          <Button
            onClick={() => {
              okx_DisConnect();
            }}
          >
            disConnect Wallet
          </Button>
        </div>
      )}

      {!okx_Connected && !uniSat_Connected && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button {...props}>Connect Wallet</Button>
          </DialogTrigger>
          <DialogContent>
            <RadioGroup
              onValueChange={(v) => {
                console.log(v);
                setOpen(false);
                if (v === Wallet.OKX) {
                  okx_Connect();
                } else if (v === Wallet.UniSat) {
                  uniSat_Connect();
                }
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
            </RadioGroup>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
