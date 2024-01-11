/*
 * @LastEditors: John
 * @Date: 2024-01-03 11:33:05
 * @LastEditTime: 2024-01-11 14:58:05
 * @Author: John
 */
import { Input } from "@/components/ui/input";
import "./Participate.scss";
import "./Participate-m.scss";
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
import { Wallet, fetchUrl, isMobile, isOKApp } from "@/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import roos_box from "@/assets/roos_box.png";
import ConnectUs from "@/components/common/ConnectUs";
import CustomToast from "@/components/common/CustomToast";

type NodeInfo = {
  nodeTotal: number;
  purchasedCount: number;
  startPrice: number;
  increasePrice: number;
  increaseCount: number;
  nodePrice: number;
  id: number;
};

type OrderInfo = { buyAmount: number; orderNumber: number; status: number };
export default function () {
  const [installed, setInstalled] = useState(false);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string>();
  const connectWalletRef = useRef<ConnectWallet_handleType>(null);
  const [num, setNum] = useState<number>(1);
  const [cost, setCost] = useState(0);
  const [nodeTotal, setNodeTotal] = useState(0);
  const [nodeRemaining, setNodeRemaining] = useState(0);

  const [userTotalBuy, setUserTotalBuy] = useState(0);

  const [nodeInfo, setNodeInfo] = useState<NodeInfo>();

  // const [orderInfo, setOrderInfo] = useState<OrderInfo>();

  function getNodeInfo() {
    fetchUrl<NodeInfo[]>("/api/node/getNodeSetting", {
      method: "GET",
    }).then((res) => {
      if (res) {
        console.log(res.data);
        const nodeData = res.data[0];
        setNodeInfo(nodeData);

        let nodeTotal = nodeData.nodeTotal;
        setNodeTotal(nodeTotal);
        setNodeRemaining(nodeTotal - nodeData.purchasedCount);
        setCost(nodeData.nodePrice);
      }

      // getNodePrice(nodeData.id);
    });
  }

  function getNodePrice(id: number) {
    fetchUrl(`/api/node/getNodePrice?nodeId=${id}`, {
      method: "GET",
    }).then((res) => {
      if (res) {
        console.log(res.data);
        setCost(res.data);
      }
    });
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
    // if (address) getUserNodeRecord();
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
      <ScrollArea className="Participate">
        <div className="content">
          <div className="card">
            <div className="left top">
              <div className="bulr-box"></div>
              <div className="model">
                {/* !isMobile && !isOKApp && */}
                {
                  // <Canvas
                  //   flat
                  //   shadows
                  //   camera={{ position: [-15, 0, 10], fov: 25 }}
                  // >
                  //   <Stage
                  //     intensity={1}
                  //     shadows={{
                  //       type: "accumulative",
                  //       bias: -0.001,
                  //       intensity: Math.PI,
                  //     }}
                  //     adjustCamera={false}
                  //   >
                  //     <Shoe scale={2} rotation={[0, Math.PI, 0]} />
                  //   </Stage>
                  //   <OrbitControls
                  //     autoRotate
                  //     autoRotateSpeed={1}
                  //     enableZoom={false}
                  //     makeDefault
                  //   />
                  //   <EffectComposer disableNormalPass>
                  //     <Bloom luminanceThreshold={2} mipmapBlur />
                  //     <ToneMapping />
                  //   </EffectComposer>
                  //   <Env />
                  // </Canvas>
                }

                <img src={roos_box} alt="" />
              </div>
            </div>

            <ScrollArea className="right bottom">
              <div className="inputContent">
                <span className="title">NODEBOX</span>
                <div className="num_tip">
                  <span>Total Supply:&nbsp;{nodeTotal}&nbsp;&nbsp;</span>
                  <span>Remaining:&nbsp;{nodeRemaining}</span>
                </div>
                <span className="des">
                  GoWrap is a cutting-edge cross-chain DeFi protocol tailored
                  for BRC20. It's designed to integrate BRC20 seamlessly into
                  the broader blockchain ecosystem by offering features like AMM
                  swapping, liquidity mining, and lending. The goal is to enable
                  cross-chain interoperability for BRC20 and provide a
                  comprehensive suite of decentralized financial services,
                  enhancing their functionality and utility across various
                  blockchain networks. OG PASS Whitelists are granted to
                  Gowrap's early community supporters. OG PASS holders are
                  entitled to a portion of the 1% $GWGW airdrop from the total
                  supply and enjoy fee discounts on all Gowrap products.
                </span>

                <div className="quantity">
                  <span>Enter quantity</span>
                  <span>
                    {/* TODO 小数位处理 */}
                    Currently 1 node {cost} BTC
                  </span>
                </div>

                <div className="input">
                  <div
                    className="reduce"
                    onClick={() => {
                      // if (num == 1) return;
                      if (num) setNum(num - 1);
                    }}
                  >
                    -
                  </div>
                  <Input
                    type="text"
                    value={num || ""}
                    onChange={(e) => {
                      setNum(parseInt(e.target.value));
                      // setNum(1);
                    }}
                  />
                  <div
                    className="add"
                    onClick={() => {
                      // if (num == 1) return;
                      if (num) {
                        setNum(num + 1);
                      } else {
                        setNum(1);
                      }
                    }}
                  >
                    +
                  </div>
                </div>
                <div className="cost-total">
                  {/* TODO 小数位处理 */}
                  <span>Cost：</span>
                  <span>{cost * (num || 0)} BTC</span>
                </div>

                {/* {connected && (
                  <>
                    {userTotalBuy > 0 && (
                      <>
                        <span>My Node</span>
                        <div>
                          <span>Nodes:</span>
                          <span>{userTotalBuy}</span>
                        </div>

                        <span>
                          Congratulations on becoming a node of XX, you can
                          enjoy the following benefits.
                        </span>
                      </>
                    )}

                    {userTotalBuy <= 0 && (
                      <span>
                        There are currently no nodes. Subscribing nodes enjoys
                        the following benefits
                      </span>
                    )}
                  </>
                )} */}

                <Button
                  className="buy-btn"
                  disabled={connected && nodeRemaining <= 0}
                  onClick={async () => {
                    if (!address) {
                      console.log(address);

                      // TODO 选择钱包弹窗✔
                      // connectWalletRef.current?._setWalletType(Wallet.OKX);
                      // connectWalletRef.current?._connect();
                      connectWalletRef.current?._selectWallet();

                      return;
                    }
                    if (typeof num === "number") {
                      if (!nodeInfo) return;
                      // TODO 购买节点✔
                      let orderInfo = await fetchUrl<
                        OrderInfo,
                        { nodeId: number; number: number; tatolAmount: number }
                      >(
                        "/api/node/pay_node",
                        {
                          method: "POST",
                        },
                        {
                          nodeId: nodeInfo.id,
                          number: num,
                          tatolAmount: num * nodeInfo.nodePrice,
                        }
                      );
                      if (orderInfo) {
                        // setOrderInfo(res.data);

                        let hash = await connectWalletRef.current?._onSubmit(
                          orderInfo.data.buyAmount,
                          "bc1p0xjywgpgdcy2ps5naqf4m44zkqptuejnk6226dwt0v3gcqv8alvqtppykk" // TODO 测试链接
                        );
                        if (hash && address) {
                          console.log("hash", hash);
                          // TODO 轮询购买是否成功

                          // 模拟轮询
                          let time = 0;
                          async function checkSuccess(
                            orderNumber: number
                          ): Promise<boolean> {
                            time++;
                            async function check() {
                              return await fetchUrl(
                                `/api/node/pay_node_sms?orderNumber=${orderNumber}}&hash=${hash}`,
                                { method: "GET" }
                              );
                              // return new Promise<{ data: boolean }>(
                              //   (reslove, reject) => {
                              //     setTimeout(() => {
                              //       console.log("check!!:", time);
                              //       if (time == 10) {
                              //         reslove({ data: true });
                              //       } else {
                              //         reslove({ data: false });
                              //       }
                              //     }, 1000);
                              //   }
                              // );
                            }

                            let ok = await check();
                            if (ok?.data) return true;
                            return checkSuccess(orderNumber);
                          }
                          let ok = await checkSuccess(
                            orderInfo.data.orderNumber
                          );
                          if (ok) CustomToast("购买成功！！！");
                        }
                      }
                    }
                  }}
                >
                  {!address
                    ? "Connent wallet"
                    : nodeRemaining > 0
                    ? "Buy"
                    : "Node Completed"}
                </Button>
              </div>
            </ScrollArea>
          </div>
        </div>
        <ConnectUs />
      </ScrollArea>
    </>
  );
}
