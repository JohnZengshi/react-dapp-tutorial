import './App.css'
import { useState, useEffect } from 'react'
import { formatBalance, formatChainAsNum } from './utils'
import detectEthereumProvider from '@metamask/detect-provider'
import { utils } from 'web3';
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"


import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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

import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from '@radix-ui/react-toast';
import { Toaster } from "@/components/ui/toaster"
import { ReloadIcon } from "@radix-ui/react-icons"

const formSchema = z.object({
  to: z.custom((val: any) => /^0x[0-9,a-f,A-F]{40}$/.test(val)),
  value: z.number().positive(),

  // gas: z.number().positive(),
  // data: z.custom((val: any) => /^0x[0-9a-f]*$/.test(val)),
  // gasPrice: z.number().positive(),
  // maxPriorityFeePerGas: z.number().positive(),
  // maxFeePerGas: z.number().positive(),

  gas: z.any(),
  data: z.any(),    
  gasPrice: z.any(),
  maxPriorityFeePerGas: z.any(),
  maxFeePerGas: z.any(),
})


const App = () => {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null)
  const initialState = { accounts: [], balance: "", chainId: "" }
  const [wallet, setWallet] = useState(initialState)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [sending, setSending] = useState<Boolean>(false)


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      to: "",
      value: 0,
      gas: "",
      data: "",
      gasPrice: "",
      maxPriorityFeePerGas: "",
      maxFeePerGas: ""

    },
  })

  const { toast } = useToast()

  useEffect(() => {
    const refreshAccounts = (accounts: any) => {
      if (accounts.length > 0) {
        updateWallet(accounts)
      } else {
        // if length 0, user is disconnected
        setWallet(initialState)
      }
    }

    const refreshChain = (chainId: any) => {
      setWallet((wallet) => ({ ...wallet, chainId }))
    }

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true })
      setHasProvider(Boolean(provider))

      if (provider) {
        const accounts = await window.ethereum.request(
          { method: 'eth_accounts' }
        )
        refreshAccounts(accounts)
        window.ethereum.on('accountsChanged', refreshAccounts)
        window.ethereum.on("chainChanged", refreshChain)
      }
    }

    getProvider()

    return () => {
      window.ethereum?.removeListener('accountsChanged', refreshAccounts)
      window.ethereum?.removeListener("chainChanged", refreshChain)
    }
  }, [])

  // 更新钱包
  const updateWallet = async (accounts: any) => {
    const balance = formatBalance(await window.ethereum!.request({
      method: "eth_getBalance",
      params: [accounts[0], "latest"],
    }))
    const chainId = await window.ethereum!.request({
      method: "eth_chainId",
    })

    console.log({ accounts, balance, chainId })
    setWallet({ accounts, balance, chainId })
  }

  // 处理连接
  const handleConnect = async () => {
    setIsConnecting(true)
    await window.ethereum.request({
      method: "eth_requestAccounts",
    })
      .then((accounts: string[]) => {
        setError(false)
        updateWallet(accounts)
      })
      .catch((err: any) => {
        setError(true)
        setErrorMessage(err.message)
      })
    setIsConnecting(false)
  }


  // 发送交易
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("form:", values)
    if (sending) return

    const params = [
      {
        from: wallet.accounts[0], // The user's active address.
        to: values.to, // Required except during contract publications.
        value: utils.toWei(values.value, 'ether'), // Only required to send ether to the recipient from the initiating external account.
      },
    ]
    console.log("params:", params)
    setSending(true)
    window.ethereum!
      .request({
        method: 'eth_sendTransaction',
        // The following sends an EIP-1559 transaction. Legacy transactions are also supported.
        params: params
      })
      .then((txHash: any) => {
        setSending(false)
        console.log(txHash)
        alert("Hash值为：" + txHash)
      })
      .catch((error: any) => {
        setSending(false)
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message,
          action: <ToastAction altText="Try again">Try again</ToastAction>,

        })
        console.error(error)
      });
  }


  const disableConnect = Boolean(wallet) && isConnecting

  return (
    <div className="App">
      <div className="space-y-1">
        <Separator className="my-4" />
        <h4 className="text-sm font-medium leading-none">Injected Provider {hasProvider ? 'DOES' : 'DOES NOT'} Exist</h4>
      </div>

      {window.ethereum?.isMetaMask && wallet.accounts.length < 1 &&
        <Button className='mt-5' disabled={disableConnect} onClick={handleConnect}>Connect MetaMask</Button>
      }

      {wallet.accounts.length > 0 &&
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
              <div className='ml-auto'> {wallet.accounts[0]}</div>
            </div>

            <div className="w-full flex h-5 items-center text-sm my-2">
              <div>Wallet Balance:</div>
              <Separator className='mx-2' orientation="vertical" />
              <div className='ml-auto'> {wallet.balance}</div>
            </div>

            <div className="w-full flex h-5 items-center text-sm my-2">
              <div>Hex ChainId:</div>
              <Separator className='mx-2' orientation="vertical" />
              <div className='ml-auto'> {wallet.chainId}</div>
            </div>

            <div className="w-full flex h-5 items-center text-sm my-2">
              <div>Numeric ChainId:</div>
              <Separator className='mx-2' orientation="vertical" />
              <div className='ml-auto'> {formatChainAsNum(wallet.chainId)}</div>
            </div>

            <Separator className="my-4" />
            <div className='flex items-center'>
              <p className="text-sm text-muted-foreground">
                发送交易:
              </p>
              <Dialog>
                <DialogTrigger className='ml-auto' asChild>
                  <Button>send transactions</Button>
                </DialogTrigger>
                <DialogContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
                      <FormField
                        control={form.control}
                        name="to"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{field.name}</FormLabel>
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
                            <FormLabel>{field.name}</FormLabel>
                            <FormControl>
                              {/* TIP */}
                              {/* 所有 HTML 输入元素值都是字符串。该库输入组件是使用 Controller 编写为受控 RHF 输入的，这意味着您需要在提交之前自行转换输入值 onChange。 */}
                              <Input {...field} type="number" onChange={event => field.onChange(parseFloat(event.target.value || "0"))} />
                            </FormControl>
                            <FormDescription>
                              交易的价值。（以太币数量）
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gas"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{field.name}</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" onChange={event => field.onChange(parseFloat(event.target.value || "0"))} />
                            </FormControl>
                            <FormDescription>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gasPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{field.name}</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" onChange={event => field.onChange(parseFloat(event.target.value || "0"))} />
                            </FormControl>
                            <FormDescription>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maxFeePerGas"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{field.name}</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" onChange={event => field.onChange(parseFloat(event.target.value || "0"))} />
                            </FormControl>
                            <FormDescription>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maxPriorityFeePerGas"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{field.name}</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" onChange={event => field.onChange(parseFloat(event.target.value || "0"))} />
                            </FormControl>
                            <FormDescription>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="data"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{field.name}</FormLabel>
                            <FormControl>
                              <Input {...field} type="text" />
                            </FormControl>
                            <FormDescription>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {sending ? <Button disabled>
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </Button> : <Button type="submit">Submit</Button>}

                    </form>
                  </Form>
                </DialogContent>
              </Dialog>


            </div>
            <Separator className="my-4" />


          </div>


        </>
      }
      {error && (
        <Alert className='w-250 mt-10' variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )
      }
      <Toaster />
    </div>
  )
}

export default App