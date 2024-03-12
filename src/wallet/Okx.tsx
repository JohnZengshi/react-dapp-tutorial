import CustomToast from "@/components/common/CustomToast";
import {
  ETHEREUM_RPC,
  WALLET_ARBITRUM_ONE,
  WALLET_ETHEREUM,
  WALLET_TEST,
} from "@/constant/wallet";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  ChainType,
  SET_BUY_LOADING,
  SET_WALLET_INSTALL,
} from "@/store/reducer";
import { BTC_Unit_Converter, isOKApp } from "@/utils";
import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useState,
} from "react";
import { toWei } from "web3-utils";
import { Contract } from "web3-eth-contract";
import { subimtByContract } from "@/utils/walletApi";
import { TYPE_ADDRESS } from "@/types";
/*
 * @LastEditors: John
 * @Date: 2024-01-02 12:58:36
 * @LastEditTime: 2024-02-22 11:51:24
 * @Author: John
 */
type Account = {
  address: TYPE_ADDRESS;
  compressedPublicKey: string;
  publicKey: string;
};
// let connecting = false; // TODO 优化connecting状态✔
export type Okx_HandleType = {
  _connect: (chainType: ChainType) => Promise<TYPE_ADDRESS>;
  _disConnect: () => Promise<void>;
  _onSubmit: (
    buyAmount: string,
    buyCount: number,
    randomNumber: number, // 随机数
    rebateRatio: number, // 返佣比例,
    pAddress: string,
    toAddress?: string
  ) => Promise<string>;
  _sign: (address: TYPE_ADDRESS, message: string) => Promise<string>;
};

const Okx = forwardRef<
  Okx_HandleType,
  {
    handleAccountsChanged: (addressInfo: Account | null) => void;
    checkInstalledOk: () => Promise<void>;
  }
>(function (props, ref) {
  const [publicKey, setPublicKey] = useState("");
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  // const [dialogOpen, setDialogOpen] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      _connect(chainType: ChainType) {
        return connect(chainType);
      },
      _disConnect() {
        return disConnect();
      },
      _onSubmit(
        buyAmount,
        buyCount,
        randomNumber, // 随机数
        rebateRatio, // 返佣比例,
        pAddress,
        toAddress
      ) {
        return onSubmit(
          buyAmount,
          buyCount,
          randomNumber,
          rebateRatio,
          pAddress,
          toAddress
        );
      },
      _sign(address, message) {
        return sign(address, message);
      },
    };
  });

  const okxwallet = window.okxwallet;

  useLayoutEffect(() => {
    (async () => {
      await checkinstall();
      await props.checkInstalledOk();
      // 监听账户变化
      // TODO 移动端无法触发？？？✔
      console.log("绑定accountChanged事件");

      // TODO btc钱包监听用户变化
      // if (user.wallet.chainType == "BTC") {
      //   okxwallet?.bitcoin?.on("accountChanged", handleAccountsChanged);
      //   return;
      // }
      okxwallet?.on("accountsChanged", (accounts: TYPE_ADDRESS[]) => {
        handleAccountsChanged({
          address: accounts[0],
          compressedPublicKey: "",
          publicKey: "",
        });
      });
    })();
    return () => {
      console.log("解绑accountChanged事件");

      // TODO btc钱包解绑用户变化时间
      // if (user.wallet.chainType == "BTC") {
      //   okxwallet?.bitcoin?.removeListener(
      //     "accountChanged",
      //     handleAccountsChanged
      //   );
      //   return;
      // }
      okxwallet?.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  // 检测是否安装okx
  function checkinstall(): Promise<void> {
    return new Promise((reslove, reject) => {
      if (typeof okxwallet !== "undefined") {
        console.log("OKX is installed!");
        // setOkxInstalled(true);
        dispatch(SET_WALLET_INSTALL(true));
        reslove();
      } else {
        // 提示用户没有安装OKX插件
        console.warn("OKX is not installed!!");
        // setOkxInstalled(false);
        dispatch(SET_WALLET_INSTALL(false));
        CustomToast("You haven't installed a wallet yet！");
      }
    });
  }

  // 连接钱包
  async function connect(chainType: ChainType) {
    return new Promise<TYPE_ADDRESS>(async (reslove, reject) => {
      await checkinstall();
      if (chainType == "BTC") {
        okxwallet?.bitcoin
          .connect()
          .then(async (result: Account | null) => {
            console.log("okxwallet.bitcoin.connect", result);
            if (!result) return CustomToast("The wallet does not support.");
            reslove(result.address);
          })
          .catch(handleCatch);
      } else {
        okxwallet
          ?.request({ method: ETHEREUM_RPC.EthRequestAccounts })
          .then(async (result) => {
            console.log("okx connect ETHEREUM :", result);
            if (result.length == 0)
              return CustomToast("The wallet does not support.");
            if (chainType == "ETHEREUM") {
              // 切换以太链
              await okxwallet?.request({
                method: ETHEREUM_RPC.WalletSwitchEthereumChain,
                params: [{ chainId: WALLET_ETHEREUM.chainId }],
              });
            } else if (chainType == "Arbitrum One") {
              // 切换arb链
              try {
                await okxwallet?.request({
                  method: ETHEREUM_RPC.WalletSwitchEthereumChain,
                  params: [{ chainId: WALLET_ARBITRUM_ONE.chainId }],
                });
                console.log("切换Arbitrum One成功");
              } catch (error: any) {
                console.log("切换失败", error);
                if (error.code === 4902) {
                  console.log("添加链");
                  await okxwallet?.request({
                    method: ETHEREUM_RPC.WalletAddEthereumChain,
                    params: [WALLET_ARBITRUM_ONE],
                  });
                }
              }
            } else if (chainType == "Arbitrum test") {
              try {
                await okxwallet?.request({
                  method: ETHEREUM_RPC.WalletSwitchEthereumChain,
                  params: [{ chainId: WALLET_TEST.chainId }],
                });
                console.log("切换Arbitrum test成功");
              } catch (error: any) {
                console.log("切换失败", error);
                if (error.code === 4902) {
                  console.log("添加链");
                  await okxwallet?.request({
                    method: ETHEREUM_RPC.WalletAddEthereumChain,
                    params: [WALLET_TEST],
                  });
                }
              }
            }
            reslove(result[0]);
          })
          .catch(handleCatch);
      }
    });
  }

  // 断开连接
  async function disConnect() {
    if (!isOKApp) {
      await okxwallet?.bitcoin.disconnect();
    }
  }

  // 用户变化
  // Account
  async function handleAccountsChanged(addressInfo: Account) {
    // clearUserData();
    props.handleAccountsChanged(addressInfo);
  }

  // TODO 监听用户切换链（需要重新登录）

  // 提交发送交易
  function onSubmit(
    buyAmount: string,
    buyCount: number,
    randomNumber: number, // 随机数
    rebateRatio: number, // 返佣比例,
    pAddress: string,
    toAddress?: string
  ) {
    // TODO btc钱包交易
    // if (user.wallet.chainType == "BTC") {
    //   return new Promise<string>((reslove, reject) => {
    //     // console.log("okxwallet.bitcoin", okxwallet?.bitcoin);

    //     if (typeof okxwallet?.bitcoin === "undefined") return;
    //     console.log(
    //       "values.satoshis * BTC_Unit_Converter",
    //       buyCount * BTC_Unit_Converter
    //     );
    //     // console.log(address, toAddress, cost * BTC_Unit_Converter);
    //     console.log("send", okxwallet.bitcoin.send);
    //     okxwallet.bitcoin
    //       .send({
    //         from: user.wallet.address,
    //         to: toAddress,
    //         value: buyCount,
    //       })
    //       .then((txid: { txhash: string }) => {
    //         // console.log(txid);

    //         // CustomToast(`请求交易成功,txid值为：${txid.txhash}`);

    //         reslove(txid.txhash);
    //       })
    //       .catch((e: any) => {
    //         console.log("用户取消交易");
    //         handleCatch(e);
    //         reject(e);
    //       });
    //   });
    // } else {
    return subimtByContract(
      BigInt(buyAmount),
      buyCount,
      randomNumber,
      rebateRatio,
      pAddress,
      okxwallet,
      user.wallet.address
    );
    // }
  }

  // 统一处理错误
  function handleCatch(e: { code: number; message: string }) {
    console.log("handle catch:", e);
    if (typeof e.message === "string") {
      console.warn(e.message);
      if (/[\u4e00-\u9fa5]/.test(e.message)) return;
      CustomToast(e.message);
    }
  }

  // 签名
  async function sign(address: TYPE_ADDRESS, message: string): Promise<string> {
    return new Promise((reslove, reject) => {
      // let address = localStorage.getItem(localStorageKey.okx_address);
      // TODO 签名✔
      // const nonce = "22a68408-fea7-4491-996c-a92fbf710a72";
      // const message = `Welcome to OKX!\n\nThis request will not trigger a blockchain transaction.\n    \nYour authentication status will reset after 24 hours.\n    \nWallet address:\n${result.address}\n    \nNonce:\n${nonce}\n`;
      // const message = "need sign string";
      // console.log("签名?", user.wallet.chainType);

      // TODO btc钱包签名
      // if (user.wallet.chainType == "BTC") {
      //   okxwallet?.bitcoin
      //     .signMessage(message, { from: address }) // OKX app 钱包新的签名方法传参（官网的方法传参不对）！！！！
      //     .then(async (sign: string) => {
      //       console.log("okx signature:", sign);
      //       reslove(sign);
      //     })
      //     .catch(handleCatch);
      // } else {
      okxwallet
        ?.request({
          method: ETHEREUM_RPC.PERSONAL_SIGN,
          params: [
            address,
            `0x${Buffer.from(message, "utf8").toString("hex")}`,
          ],
        })
        .then((sign) => {
          console.log(sign);
          reslove(sign);
        })
        .catch((err) => handleCatch(err));
      // }
    });
  }

  return <></>;
});

export default Okx;
