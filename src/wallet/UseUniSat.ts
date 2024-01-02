import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import sdk from "@unisat/wallet-sdk";

const formSchema = z.object({
  toAddress: z.string(),
  satoshis: z.number().positive(),
});

const BTC_Unit_Converter = 100000000;

export default function () {
  const [unisatInstalled, setUnisatInstalled] = useState(false);
  const [connected, setConnected] = useState(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [publicKey, setPublicKey] = useState("");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState({
    confirmed: 0,
    unconfirmed: 0,
    total: 0,
  });
  const [network, setNetwork] = useState("livenet");
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState<Boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      toAddress: "",
      satoshis: 0,
    },
  });

  const getBasicInfo = async () => {
    const unisat = (window as any).unisat;
    const [address] = await unisat.getAccounts();
    setAddress(address);

    const publicKey = await unisat.getPublicKey();
    setPublicKey(publicKey);

    const balance = await unisat.getBalance();
    setBalance(balance);

    const network = await unisat.getNetwork();
    setNetwork(network);
  };

  const selfRef = useRef<{ accounts: string[] }>({
    accounts: [],
  });
  const self = selfRef.current;
  const handleAccountsChanged = (_accounts: string[]) => {
    if (self.accounts[0] === _accounts[0]) {
      // prevent from triggering twice
      return;
    }
    self.accounts = _accounts;
    if (_accounts.length > 0) {
      setAccounts(_accounts);
      setConnected(true);

      setAddress(_accounts[0]);

      getBasicInfo();
    } else {
      setConnected(false);
    }
  };

  const handleNetworkChanged = (network: string) => {
    setNetwork(network);
    getBasicInfo();
  };

  // 发送交易
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("form:", values);

    console.log(
      "values.satoshis * BTC_Unit_Converter",
      values.satoshis * BTC_Unit_Converter
    );
    if (sending) return;

    setSending(true);
    unisat
      .sendBitcoin(
        values.toAddress, // Required except during contract publications.
        Math.round(values.satoshis * BTC_Unit_Converter)
      )
      .then((txHash: string) => {
        setSending(false);
        console.log(txHash);
        // alert("Hash值为：" + txHash)
        toast({
          title: "交易处理中",
          description: "Hash值为：" + txHash,
        });

        setOpen(false);
      })
      .catch((error: any) => {
        setSending(false);
        // toast({
        //   variant: "destructive",
        //   title: "Uh oh! Something went wrong.",
        //   description: error.message,
        //   action: <ToastAction altText="Try again">Try again</ToastAction>,
        // });
        console.error(error);
      });
  }

  async function connect() {
    const result = await unisat.requestAccounts();
    handleAccountsChanged(result);
  }

  useEffect(() => {
    async function checkUnisat() {
      let unisat = (window as any).unisat;

      for (let i = 1; i < 10 && !unisat; i += 1) {
        await new Promise((resolve) => setTimeout(resolve, 100 * i));
        unisat = (window as any).unisat;
      }

      if (unisat) {
        console.log("unisat", unisat);
        setUnisatInstalled(true);
      } else if (!unisat) return;

      unisat.getAccounts().then((accounts: string[]) => {
        handleAccountsChanged(accounts);
      });

      unisat.on("accountsChanged", handleAccountsChanged);
      unisat.on("networkChanged", handleNetworkChanged);

      return () => {
        unisat.removeListener("accountsChanged", handleAccountsChanged);
        unisat.removeListener("networkChanged", handleNetworkChanged);
      };
    }

    checkUnisat().then();
  }, []);

  const unisat = (window as any).unisat;

  // return (
  //   <>
  //     {/* UniSat */}
  //     <div className="space-y-1 mt-10">
  //       <Separator className="my-4" />
  //       <div className="flex items-center">
  //         <Badge variant="default" className="mr-5">
  //           UniSat
  //         </Badge>
  //         <h4 className="text-sm font-medium leading-none">
  //           Injected Provider {unisatInstalled ? "DOES" : "DOES NOT"} Exist
  //         </h4>
  //       </div>
  //     </div>

  //     {!connected && unisatInstalled && (
  //       <Button
  //         className="mt-5"
  //         disabled={connected}
  //         onClick={async () => {
  //           const result = await unisat.requestAccounts();
  //           handleAccountsChanged(result);
  //         }}
  //       >
  //         Connect UniSat
  //       </Button>
  //     )}

  //     {connected && accounts.length > 0 && (
  //       <>
  //         <div>
  //           <div>
  //             <Separator className="my-4" />
  //             <p className="text-sm text-muted-foreground">钱包信息：</p>
  //             <Separator className="my-4" />

  //             <div className="w-full flex h-5 items-center text-sm my-2">
  //               <div>Wallet Accounts: </div>
  //               <Separator className="mx-2" orientation="vertical" />
  //               <div className="ml-auto"> {address}</div>
  //             </div>

  //             <div className="w-full flex h-5 items-center text-sm my-2">
  //               <div>Wallet Balance:</div>
  //               <Separator className="mx-2" orientation="vertical" />
  //               <div className="ml-auto">
  //                 {" "}
  //                 {balance.total / BTC_Unit_Converter}
  //               </div>
  //             </div>

  //             <div className="w-full flex h-5 items-center text-sm my-2">
  //               <div>public key:</div>
  //               <Separator className="mx-2" orientation="vertical" />
  //               <div className="ml-auto"> {publicKey}</div>
  //             </div>

  //             <div className="w-full flex h-5 items-center text-sm my-2">
  //               <div>network:</div>
  //               <Separator className="mx-2" orientation="vertical" />
  //               <div className="ml-auto"> {network}</div>
  //             </div>
  //           </div>

  //           <Separator className="my-4" />
  //           <div className="flex items-center">
  //             <p className="text-sm text-muted-foreground">发送交易:</p>
  //             <Dialog open={open} onOpenChange={setOpen}>
  //               <DialogTrigger className="ml-auto" asChild>
  //                 <Button>send transactions</Button>
  //               </DialogTrigger>
  //               <DialogContent>
  //                 <ScrollArea>
  //                   <Form {...form}>
  //                     <form
  //                       onSubmit={form.handleSubmit(onSubmit)}
  //                       className="space-y-1 p-5"
  //                     >
  //                       <FormField
  //                         control={form.control}
  //                         name="toAddress"
  //                         render={({ field }) => (
  //                           <FormItem>
  //                             <FormLabel>{field.name + "（*必填）:"}</FormLabel>
  //                             <FormControl>
  //                               <Input {...field} type="text" />
  //                             </FormControl>
  //                             <FormDescription>
  //                               交易的目标地址。
  //                             </FormDescription>
  //                             <FormMessage />
  //                           </FormItem>
  //                         )}
  //                       />

  //                       <FormField
  //                         control={form.control}
  //                         name="satoshis"
  //                         render={({ field }) => (
  //                           <FormItem>
  //                             <FormLabel>{field.name + "（*必填）:"}</FormLabel>
  //                             <FormControl>
  //                               {/* TIP */}
  //                               {/* 所有 HTML 输入元素值都是字符串。该库输入组件是使用 Controller 编写为受控 RHF 输入的，这意味着您需要在提交之前自行转换输入值 onChange。 */}
  //                               <Input
  //                                 {...field}
  //                                 value={isNaN(field.value) ? "" : field.value}
  //                                 type="number"
  //                                 onChange={(event) =>
  //                                   field.onChange(
  //                                     parseFloat(event.target.value)
  //                                   )
  //                                 }
  //                               />
  //                             </FormControl>
  //                             <FormDescription>
  //                               交易的价值。（以太币数量）
  //                             </FormDescription>
  //                             <FormMessage />
  //                           </FormItem>
  //                         )}
  //                       />
  //                       <div className="pt-10">
  //                         {sending ? (
  //                           <Button disabled>
  //                             <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
  //                             Please wait
  //                           </Button>
  //                         ) : (
  //                           <Button type="submit">Submit</Button>
  //                         )}
  //                       </div>
  //                     </form>
  //                   </Form>
  //                 </ScrollArea>
  //               </DialogContent>
  //             </Dialog>
  //           </div>
  //           <Separator className="my-4" />
  //         </div>
  //       </>
  //     )}
  //   </>
  // );

  return {
    unisatInstalled,
    connect,
    connected,
    accounts,
    publicKey,
    address,
    balance,
    network,
    sending,
  };
}
