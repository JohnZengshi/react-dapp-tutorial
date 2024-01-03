/*
 * @LastEditors: John
 * @Date: 2024-01-03 11:33:05
 * @LastEditTime: 2024-01-03 17:31:34
 * @Author: John
 */
import { Input } from "@/components/ui/input";
import "./Participate.css";
import { Button } from "@/components/ui/button";
import ConnectWallet, {
  ConnectWallet_handleType,
} from "@/components/common/ConnectWallet";
import { useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import Nav from "@/components/common/Nav";

export default function () {
  const [installed, setInstalled] = useState(false);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string>();
  const connectWalletRef = useRef<ConnectWallet_handleType>(null);
  const [num, setNum] = useState<number>();
  const [cost, setCost] = useState(0.00001);
  return (
    <>
      <Nav
        connectBtn={
          <ConnectWallet
            ref={connectWalletRef}
            onUpdate={(i, c, a) => {
              console.log(a);
              setConnected(c);
              setInstalled(i);
              setAddress(a);
            }}
          />
        }
      />
      <div className="container">
        <div className="card">
          <div className="card_1">
            <div className="card_1_1">Phase 2</div>
          </div>

          <div className="card_2">
            <div className="card_2_1">
              <div className="card_2_1_1 flex flex-col gap-4">
                <span
                  className="font-black"
                  style={{
                    fontSize: "28px",
                    lineHeight: "110%",
                    color: "#000",
                  }}
                >
                  Buy Node
                </span>
                <div
                  className="flex-row flex justify-between"
                  style={{ alignItems: "center" }}
                >
                  <span
                    style={{
                      fontWeight: 500,
                      fontSize: "16px",
                      textAlign: "left",
                      lineHeight: "140%",
                      color: "#000",
                    }}
                  >
                    Purchased quantity
                  </span>
                  <Progress value={60} />
                </div>
                <div
                  className="w-full"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      color: "#59d89d",
                      fontWeight: 500,
                      fontSize: "16px",
                      textAlign: "left",
                      lineHeight: "140%",
                    }}
                  >
                    Enter quantity
                  </span>
                  <span
                    style={{
                      color: "#59d89d",
                      fontWeight: 500,
                      fontSize: "16px",
                      textAlign: "left",
                      lineHeight: "140%",
                    }}
                  >
                    Currently 1 node {cost} BTC
                  </span>
                </div>
              </div>
              <div className="card_2_1_2">
                <div className="">{/* <span>BTC</span> */}</div>
              </div>

              <Input
                style={{ color: "#000" }}
                type="number"
                value={num || ""}
                onChange={(e) => {
                  setNum(parseInt(e.target.value));
                }}
              />
              <span className="ml-auto">
                Cost：{(cost * (num || 0)).toFixed(8)} BTC
              </span>

              <Button
                disabled={!connected}
                onClick={() => {
                  if (typeof num === "number") {
                    connectWalletRef.current?._onSubmit(
                      cost * num,
                      "tb1qlketwhc53kcnq3smvvjvwpsf2yfayhpkyf72y4"
                    );
                  }
                }}
              >
                Buy
              </Button>
              <span style={{ marginTop: "10px" }}>address:{address}</span>

              <span
                className="font-black"
                style={{
                  fontSize: "28px",
                  lineHeight: "110%",
                  color: "#000",
                }}
              >
                My Node
              </span>

              <div className="flex flex-row justify-between w-full">
                <span>Nodes:</span>
                <span>1</span>
              </div>

              <span>
                Congratulations on becoming a node of XX, you can enjoy the
                following benefits.
              </span>

              <span
                className="font-black"
                style={{
                  fontSize: "28px",
                  lineHeight: "110%",
                  color: "#000",
                }}
              >
                Node equity
              </span>
              <span style={{ fontSize: "14px" }}>
                .25% of platform tokens .Permanently enjoy network gas fee
                dividends (the initial proportion is as high as 70%, and with
                the development of the ecosystem in the later period, the
                community will vote to determine the redistribution proportion)
                .X% proportion of GAS fee airdrop activity rewards high weight
                voting rights .A series of other ecological development rights
                and interests
              </span>
            </div>
            <div className="card_2_2"></div>
          </div>
        </div>
      </div>
    </>
  );
}
