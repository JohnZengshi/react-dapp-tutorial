/*
 * @LastEditors: John
 * @Date: 2024-01-03 11:33:05
 * @LastEditTime: 2024-01-07 23:03:06
 * @Author: John
 */
import { Input } from "@/components/ui/input";
import "./Participate.scss";
import { Button } from "@/components/ui/button";
import ConnectWallet, {
  ConnectWallet_handleType,
} from "@/components/common/ConnectWallet";
import { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import Nav from "@/components/common/Nav";
import zepoch from "@/assets/zepoch.mp4";
import box from "@/assets/20240105-152907.png";

import { Canvas } from "@react-three/fiber";
import {
  BakeShadows,
  Environment,
  Grid,
  OrbitControls,
  Stage,
} from "@react-three/drei";
import Shoe, { Env } from "@/components/common/Shoe";
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";

export default function () {
  const [installed, setInstalled] = useState(false);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string>();
  const connectWalletRef = useRef<ConnectWallet_handleType>(null);
  const [num, setNum] = useState<number>();
  const [cost, setCost] = useState(0);
  const [nodeTotal, setNodeTotal] = useState(0);
  const [nodeRemaining, setNodeRemaining] = useState(0);

  const [userTotalBuy, setUserTotalBuy] = useState(0);

  function getNodeInfo() {
    fetch(`${import.meta.env.VITE_BASE_API_URL}/node/queryById?id=3`)
      .then((response) => {
        return response.json();
      })
      .then(
        (data: {
          code: number;
          message: string;
          result: {
            nodeTotal: string;
            purchasedCount: number;
            startPrice: number;
            increasePrice: number;
            increaseCount: number;
          };
          success: boolean;
          timestamp: number;
        }) => {
          console.log(data.result);
          let nodeTotal = parseInt(data.result.nodeTotal);
          setNodeTotal(nodeTotal);
          setNodeRemaining(nodeTotal - data.result.purchasedCount);
          setCost(data.result.startPrice);
        }
      );
  }

  function getUserNodeRecord() {
    fetch(
      `${
        import.meta.env.VITE_BASE_API_URL
      }/subscribe/queryByWalletAddress?walletAddress=${address}`
    )
      .then((response) => {
        return response.json();
      })
      .then(
        (data: {
          code: number;
          message: string;
          result: {
            total: number;
            list: {
              walletAddress: string;
              recommendId: number;
              buyCount: number;
              payCoin: string;
              buyAmount: number;
              createTime: string;
            }[];
          };
          success: boolean;
          timestamp: number;
        }) => {
          console.log(data.result);
          setUserTotalBuy(
            data.result.list.reduce((sum, v) => (sum += v.buyCount), 0)
          );
        }
      );
  }

  useEffect(() => {
    getNodeInfo();
  }, []);

  useEffect(() => {
    if (address) getUserNodeRecord();
  }, [address]);
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
      <div className="Participate">
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
                  className="nodeCount flex-row flex justify-between"
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
                  {/* <Progress value={60} /> */}
                  <div>
                    <span>Remaining:&nbsp;{nodeRemaining}</span>
                    &nbsp;&nbsp;&nbsp;
                    <span>Total:&nbsp;{nodeTotal}</span>
                  </div>
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
                    {/* TODO 小数位处理 */}
                    Currently 1 node {cost.toFixed(8)} BTC
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
                {/* TODO 小数位处理 */}
                Cost：{(cost * (num || 0)).toFixed(8)} BTC
              </span>

              <Button
                disabled={!connected || nodeRemaining <= 0}
                onClick={() => {
                  if (typeof num === "number") {
                    connectWalletRef.current
                      ?._onSubmit(
                        cost * num,
                        "tb1qlketwhc53kcnq3smvvjvwpsf2yfayhpkyf72y4" // TODO 测试链接
                      )
                      .then((ok) => {
                        if (ok && address) {
                          // console.log("交易成功");
                          const postData: { [key: string]: number | string } = {
                            buyAmount: cost * num,
                            buyCount: num,
                            payCoin: "BTC",
                            walletAddress: address,
                            nodeId: 3,
                          };
                          const queryString = Object.keys(postData)
                            .map(
                              (key) =>
                                `${encodeURIComponent(
                                  key
                                )}=${encodeURIComponent(postData[key])}`
                            )
                            .join("&");
                          fetch(
                            `${
                              import.meta.env.VITE_BASE_API_URL
                            }/subscribe/add?${queryString}`,
                            {
                              method: "POST",
                            }
                          )
                            .then((response) => {
                              if (!response.ok) {
                                throw new Error(
                                  `HTTP error! Status: ${response.status}`
                                );
                              }
                              return response.json(); // 如果返回的是 JSON 数据，使用 json() 方法解析
                            })
                            .then((data) => {
                              console.log("Response data:", data);

                              getNodeInfo(); // 更新节点信息
                              getUserNodeRecord(); // 更新用户购买记录
                              // 在这里处理返回的数据
                            })
                            .catch((error) => {
                              console.error("Error:", error);
                              // 在这里处理请求发生的错误
                            });
                        }
                      });
                  }
                }}
              >
                {nodeRemaining > 0 ? "Buy" : "Node Completed"}
              </Button>
              {/* <span style={{ marginTop: "10px" }}>address:{address}</span> */}

              {connected && (
                <>
                  {userTotalBuy > 0 && (
                    <>
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
                        <span>{userTotalBuy}</span>
                      </div>

                      <span>
                        Congratulations on becoming a node of XX, you can enjoy
                        the following benefits.
                      </span>
                    </>
                  )}

                  {userTotalBuy <= 0 && (
                    <span>
                      There are currently no nodes. Subscribing nodes enjoys the
                      following benefits
                    </span>
                  )}
                </>
              )}

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
            <div className="card_2_2">
              {/* <video
                muted
                autoPlay
                loop
                style={{
                  pointerEvents: "none",
                  userSelect: "none",
                  display: "block",
                  verticalAlign: "middle",
                  borderRadius: "12px",
                }}
              >
                <source src={zepoch} type="video/mp4" />
              </video> */}
              {/* <img src={box} alt="" /> */}
              {/* <Canvas shadows camera={{ position: [0, 0, 150], fov: 40 }}>
                <Stage environment="city" intensity={0.6}>
                  <Shoe
                    color="orange"
                    scale={-1}
                    rotation={[0, 0.5, Math.PI]}
                    position={[0, 0, -2]}
                  />
                </Stage>
                <BakeShadows />
                <OrbitControls makeDefault autoRotate />
              </Canvas> */}

              <Canvas flat shadows camera={{ position: [-15, 0, 10], fov: 25 }}>
                {/* <fog attach="fog" args={["black", 15, 21.5]} /> */}
                <Stage
                  intensity={1}
                  // environment="city"
                  shadows={{
                    type: "accumulative",
                    bias: -0.001,
                    intensity: Math.PI,
                  }}
                  adjustCamera={false}
                >
                  <Shoe scale={2} rotation={[0, Math.PI, 0]} />
                </Stage>
                {/* <Grid
                  renderOrder={-1}
                  position={[0, -1.85, 0]}
                  infiniteGrid
                  cellSize={0.6}
                  cellThickness={0.6}
                  sectionSize={3.3}
                  sectionThickness={1.5}
                  fadeDistance={30}
                /> */}
                <OrbitControls
                  autoRotate
                  autoRotateSpeed={1}
                  enableZoom={false}
                  makeDefault
                  minPolarAngle={Math.PI / 2}
                  maxPolarAngle={Math.PI / 2}
                />
                <EffectComposer disableNormalPass>
                  <Bloom luminanceThreshold={2} mipmapBlur />
                  <ToneMapping />
                </EffectComposer>
                {/* <Environment background={false} preset="apartment" blur={0.8} /> */}
                <Env />
              </Canvas>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
