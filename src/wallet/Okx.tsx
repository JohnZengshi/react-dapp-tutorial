import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

/*
 * @LastEditors: John
 * @Date: 2024-01-02 12:58:36
 * @LastEditTime: 2024-01-03 09:40:14
 * @Author: John
 */
type Account = {
  address: string;
  compressedPublicKey: string;
  publicKey: string;
};

export type Okx_HandleType = {
  _connect: () => void;
};

const Okx = forwardRef<
  Okx_HandleType,
  {
    onUpdate: (
      okxInstalled: boolean,
      connected: boolean,
      address: string | undefined
    ) => void;
  }
>(function (props, ref) {
  const [okxInstalled, setOkxInstalled] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<string>();

  useImperativeHandle(ref, () => {
    return {
      _connect() {
        connect();
      },
    };
  });

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    props.onUpdate(okxInstalled, connected, address);
  }, [okxInstalled, connected, address]);

  async function init() {
    if (typeof window.okxwallet !== "undefined") {
      console.log("OKX is installed!");
      setOkxInstalled(true);
      connect();
    } else {
      // 用户没有安装OKX插件
      console.warn("OKX is not installed!!");
    }
  }

  async function connect() {
    window.okxwallet.bitcoin
      .connect()
      .then((result: Account) => {
        setAddress(result.address);
        setConnected(true);
        updateBalance(result.address);

        window.okxwallet.bitcoin.on(
          "accountChanged",
          (addressInfo: Account) => {
            console.log("accounts changed:", addressInfo);
            if (addressInfo === null) {
              setConnected(false);
              setAddress("");
            }
          }
        );
      })
      .catch(handleCatch);
  }

  async function disConnect() {
    await window.okxwallet.bitcoin.disconnect();
    setAddress("");
    setConnected(false);
  }

  async function updateBalance(address: string) {}

  function handleCatch(e: { code: number; message: string }) {
    // console.log(e);
    if (e.code === 4001) {
      // 用户没有创建钱包
      console.warn(e.message);
    }
  }
  return <></>;
});

export default Okx;
