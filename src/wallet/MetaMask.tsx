import { useState, useEffect } from 'react'
import { formatBalance, formatValue } from '@/utils'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"


import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from '@radix-ui/react-toast';
import { Toaster } from "@/components/ui/toaster"
import { ReloadIcon } from "@radix-ui/react-icons"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Buffer } from 'buffer';
import { SiweMessage } from "siwe"
import { BrowserProvider } from 'ethers';
import { useSDK } from '@metamask/sdk-react';



const formSchema = z.object({
  to: z.custom((val: any) => /^0x[0-9,a-f,A-F]{40}$/.test(val)),
  value: z.number().positive(),

  gas: z.number(),
  // data: z.custom((val: any) => /^0x[0-9a-f]*$/.test(val)),
  gasPrice: z.number(),
  maxPriorityFeePerGas: z.number(),
  maxFeePerGas: z.number(),
})


const MetaMask = () => {
  const [open, setOpen] = useState(false);
  const [siweSignStr, setSiweSignStr] = useState<string>("")
  const [siweSignLoading, setSiweSignLoading] = useState<boolean>(false)
  const [sendingTransaction, setSendingTransaction] = useState<boolean>(false)
  const { toast } = useToast()
  // 接入sdk
  const { sdk, account, balance, chainId, connected, connecting, provider } = useSDK();

  // 定义表单
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      to: "",
      value: 0,
      gas: 0,
      // data: "",
      gasPrice: 0,
      maxPriorityFeePerGas: 0,
      maxFeePerGas: 0

    },
  })

  useEffect(() => {
  }, [])

  // 处理连接
  const connect = async () => {
    try {
      await sdk?.connect()
    } catch (err) {
      console.warn(`failed to connect..`, err);
    }
  };
  // 发送交易
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("form:", values)
    if (sendingTransaction) return

    const params = [
      {
        from: account, // The user's active address.
        to: values.to, // Required except during contract publications.
        // value: utils.toWei(values.value, 'ether'), // Only required to send ether to the recipient from the initiating external account.
        value: formatValue(values.value)
      },
    ]
    console.log("params:", params)
    setSendingTransaction(true)

    provider?.request({ method: "eth_sendTransaction", params })
      .then((txHash: any) => {
        setSendingTransaction(false)
        console.log(txHash)
        // alert("Hash值为：" + txHash)
        toast({
          title: "交易处理中",
          description: "Hash值为：" + txHash,
        })

        setOpen(false)
      })
      .catch((error: any) => {
        setSendingTransaction(false)
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message,
          action: <ToastAction altText="Try again">Try again</ToastAction>,

        })
        console.error(error)
      });
  }
  // 登录
  const siweSign = async (siweMessage: string) => {
    setSiweSignLoading(true)
    try {
      const from = account;
      const msg = `0x${Buffer.from(siweMessage, 'utf8').toString('hex')}`;
      const sign = await provider?.request({
        method: 'personal_sign',
        params: [msg, from],
      });
      console.log(sign)
      if (typeof sign == "string") setSiweSignStr(sign)
      setSiweSignLoading(false)
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: err.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
      setSiweSignLoading(false)
    }
  };
  async function createSiweMessage(statement: string) {
    const domain = window.location.host;
    const origin = window.location.origin;
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const siweMessage = new SiweMessage({
      domain,
      address: signer.address,
      statement,
      uri: origin,
      version: '1',
      chainId: 1
    });
    return siweMessage.prepareMessage();
  }

  return (
    <>
      {/* MetaMask */}
      <div className="space-y-1">
        <Separator className="my-4" />
        <div className='flex items-center'>
          <Badge variant="default" className='mr-5'>MetaMask</Badge>
          <h4 className="text-sm font-medium leading-none">Injected Provider {provider ? 'DOES' : 'DOES NOT'} Exist</h4>
        </div>
      </div>

      {/* <div>{connecting + ":" + connected}</div> */}
      {!account && <>
        {connecting ?
          <Button disabled className='ml-auto'>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
          :
          <Button className='mt-5' onClick={connect}>Connect MetaMask</Button>
        }
      </>}

      {account &&
        <>
          <div>
            <Separator className="my-4" />
            <p className="text-sm text-muted-foreground">
              钱包信息：
            </p>
            <Separator className="my-4" />

            <div className="w-full flex h-5 items-center text-sm my-2">
              <div>Wallet Accounts: </div>
              <Separator className='mx-2' orientation="vertical" />
              <div className='ml-auto'> {account}</div>
            </div>

            <div className="w-full flex h-5 items-center text-sm my-2">
              <div>Wallet Balance:</div>
              <Separator className='mx-2' orientation="vertical" />
              <div className='ml-auto'> {formatBalance(balance || "0")}</div>
            </div>

            <div className="w-full flex h-5 items-center text-sm my-2">
              <div>Hex ChainId:</div>
              <Separator className='mx-2' orientation="vertical" />
              <div className='ml-auto'> {chainId}</div>
            </div>

            <Separator className="my-4" />
            <div className='flex items-center'>
              <p className="text-sm text-muted-foreground">
                发送交易:
              </p>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className='ml-auto' asChild>
                  <Button>send transactions</Button>
                </DialogTrigger>
                <DialogContent>
                  <ScrollArea className="h-[400px]">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1 p-5">
                        <FormField
                          control={form.control}
                          name="to"

                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{field.name + "（*必填）:"}</FormLabel>
                              <FormControl>
                                <Input {...field} type="text" />
                              </FormControl>
                              <FormDescription>
                                交易的目标地址。
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="value"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{field.name + "（*必填）:"}</FormLabel>
                              <FormControl>
                                {/* TIP */}
                                {/* 所有 HTML 输入元素值都是字符串。该库输入组件是使用 Controller 编写为受控 RHF 输入的，这意味着您需要在提交之前自行转换输入值 onChange。 */}
                                <Input {...field} value={isNaN(field.value) ? "" : field.value} type="number" onChange={event => field.onChange(parseFloat(event.target.value))} />
                              </FormControl>
                              <FormDescription>
                                交易的价值。（以太币数量）
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />


                        <div className='pt-10'>
                          {sendingTransaction ?
                            <Button disabled >
                              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                              Please wait
                            </Button>
                            :
                            <Button type="submit">Submit</Button>
                          }
                        </div>

                      </form>
                    </Form>
                  </ScrollArea>

                </DialogContent>
              </Dialog>


            </div>
            <Separator className="my-4" />

            <div className='flex items-center'>
              <p className="text-sm text-muted-foreground">
                Sign in with Ethereum:
              </p>

              {siweSignLoading ?
                <Button disabled className='ml-auto'>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
                :
                <Button className='ml-auto' onClick={async () => {
                  const siweMessage = await createSiweMessage("this is new statement!!")
                  siweSign(siweMessage);
                }}>Sign in</Button>
              }
            </div>

            {siweSignStr != "" && <>
              <Separator className="my-4" />
              <div className="w-full flex items-center text-sm my-2">
                <div>Sign: </div>
                <Separator className='mx-2' orientation="vertical" />
                <div className='ml-auto max-w-xs' style={{ overflowWrap: "break-word" }}> {siweSignStr}</div>
              </div>
            </>}
            <Separator className="my-4" />
            <div className='flex items-center'>
              <p className="text-sm text-muted-foreground">
                Get permissions:
              </p>

              <Button className='ml-auto' onClick={async () => {
                provider?.request({ method: "wallet_getPermissions" }).then((res) => {
                  console.log(res);
                })
              }}>Get Permission</Button>
            </div>
            <Separator className="my-4" />
            <div className='flex items-center'>
              <p className="text-sm text-muted-foreground">
                Revoke permissions:
              </p>

              <Button className='ml-auto' onClick={async () => {
                provider?.request({ method: "wallet_revokePermissions", params: [{}] }).then((res) => {
                  console.log(res);
                })
              }}>Revoke Permission</Button>
            </div>
            <Separator className="my-4" />
          </div>
        </>
      }
      <Toaster />
    </>
  )
}

export default MetaMask