import { zodResolver } from "@hookform/resolvers/zod";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BTC_Unit_Converter } from "@/utils";
import CustomToast from "@/components/common/CustomToast";
import { useAppDispatch } from "@/store/hooks";
import { SET_UNISAT_WALLET_INSTALL } from "@/store/reducer";
import { TYPE_ADDRESS } from "@/types";

const formSchema = z.object({
  toAddress: z.string(),
  satoshis: z.number().positive(),
});

export type UniSat_handleType = {
  _connect: () => Promise<string>;
  _disConnect: () => Promise<void>;
  _onSubmit: (cost: number, toAddress: string) => Promise<string>;
  _sign: (address: TYPE_ADDRESS, message: string) => Promise<string>;
};
const UniSat = forwardRef<
  UniSat_handleType,
  {
    handleAccountsChanged: (_accounts: TYPE_ADDRESS[]) => void;
    checkInstalledOk: () => Promise<void>;
  }
>(function (props, ref) {
  const unisat = window.unisat;
  const dispatch = useAppDispatch();

  useImperativeHandle(ref, () => {
    return {
      _connect() {
        return connect();
      },
      _disConnect() {
        return disConnect();
      },
      _onSubmit(cost: number, toAddress: string) {
        return onSubmit(cost, toAddress);
      },
      _sign(address, message) {
        return sign(address, message);
      },
    };
  });

  // 切换钱包
  const handleAccountsChanged = (_accounts: TYPE_ADDRESS[]) => {
    props.handleAccountsChanged(_accounts);
  };

  // 切换网络
  const handleNetworkChanged = (network: string) => {};

  // 发送交易
  function onSubmit(cost: number, toAddress: string): Promise<string> {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    return new Promise((reslove, reject) => {
      console.log(
        "unisat send bitcoin:",
        toAddress,
        Math.round(cost * BTC_Unit_Converter)
      );

      unisat
        ?.sendBitcoin(
          toAddress, // Required except during contract publications.
          Math.round(cost * BTC_Unit_Converter)
        )
        .then((txHash) => {
          // alert("Hash值为：" + txHash)
          // CustomToast(`交易成功,Hash值为：${txHash}`);

          reslove(txHash);
        })
        .catch((error) => {
          console.log("用户取消交易");
          handleCatch(error);
          reject("");
        });
    });
  }

  // 连接钱包
  async function connect(): Promise<string> {
    return new Promise<string>(async (reslove, reject) => {
      await checkInstall();
      unisat
        ?.requestAccounts()
        .then(async (accounts) => {
          console.log("unisat.requestAccounts", accounts);
          if (accounts.length == 0) return CustomToast("connect fail!");
          reslove(accounts[0]);
        })
        .catch(handleCatch);
    });
  }

  // 断开连接
  function disConnect() {
    return new Promise<void>((reslove, reject) => {
      reslove();
    });
  }

  // 检测是否安装unisat
  function checkInstall(): Promise<void> {
    return new Promise((reslove, reject) => {
      if (typeof unisat !== "undefined") {
        console.log("UNISAT is installed!");
        dispatch(SET_UNISAT_WALLET_INSTALL(true));
        reslove();
      } else {
        // 提示用户没有安装OKX插件
        console.warn("UNISAT is not installed!!");
        dispatch(SET_UNISAT_WALLET_INSTALL(false));
        CustomToast("You haven't installed a wallet yet！");
      }
    });
  }

  // 签名
  async function sign(address: TYPE_ADDRESS, message: string): Promise<string> {
    return new Promise(async (reslove, reject) => {
      try {
        let sign = await unisat?.signMessage(message);
        console.log("unisat signature:", sign);
        if (sign) reslove(sign);
      } catch (e: any) {
        handleCatch(e);
      }
    });
  }
  useLayoutEffect(() => {
    (async () => {
      await checkInstall();
      await props.checkInstalledOk();

      unisat?.on("accountsChanged", handleAccountsChanged);
      unisat?.on("networkChanged", handleNetworkChanged);
    })();
    return () => {
      unisat?.removeListener("accountsChanged", handleAccountsChanged);
      unisat?.removeListener("networkChanged", handleNetworkChanged);
    };
  }, []);

  function handleCatch(e: { code: number; message: string }) {
    // console.log(e);
    if (e.code === 4001) {
      // 用户没有创建钱包
      console.warn(e.message);
      CustomToast(`${e.message}`);
    }
  }
  return <></>;
});

export default UniSat;
