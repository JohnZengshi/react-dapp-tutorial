import { useEffect, useState } from "react";

/*
 * @LastEditors: John
 * @Date: 2024-01-02 12:58:36
 * @LastEditTime: 2024-01-02 17:44:36
 * @Author: John
 */
type Account = {
  address: string;
  compressedPublicKey: string;
  publicKey: string;
};
export default function () {
  const [okxInstalled, setOkxInstalled] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<string>();

  useEffect(() => {
    init();
  }, []);

  async function init() {
    if (typeof window.okxwallet !== "undefined") {
      console.log("OKX is installed!");
      setOkxInstalled(true);
      // connect();
    }
  }

  async function connect() {
    const result: Account = await window.okxwallet.bitcoin.connect();
    setAddress(result.address);
    setConnected(true);
    updateBalance(result.address);
  }

  async function disConnect() {
    await window.okxwallet.bitcoin.disconnect();
    setAddress("");
    setConnected(false);
  }

  async function updateBalance(address: string) {}

  return {
    connect,
    disConnect,
    address,
    connected,
    okxInstalled,
  };
}
