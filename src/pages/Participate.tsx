/*
 * @LastEditors: John
 * @Date: 2024-01-03 11:33:05
 * @LastEditTime: 2024-01-12 20:53:02
 * @Author: John
 */
import { Input } from "@/components/ui/input";
import "./Participate.scss";
import "./Participate-m.scss";
import { Button, ButtonProps } from "@/components/ui/button";
import ConnectWallet, {
  ConnectWallet_handleType,
} from "@/components/common/ConnectWallet";
import {
  Fragment,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
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
import { Wallet, fetchUrl, isMobile, isOKApp, localStorageKey } from "@/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import roos_box from "@/assets/roos_box.png";
import ConnectUs from "@/components/common/ConnectUs";
import CustomToast from "@/components/common/CustomToast";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import Invite from "@/components/common/Invite";
import { SET_NOTIFICATION_TRIGGER_EVENT, SET_PAY_INFO } from "@/store/reducer";
import { API_PAY_NODE_SMS } from "@/utils/api";
type NodeInfo = {
  nodeTotal: number;
  purchasedCount: number;
  startPrice: number;
  increasePrice: number;
  increaseCount: number;
  nodePrice: number;
  id: number;
  nodeName: string;
};

type OrderInfo = { buyAmount: number; orderNumber: number; status: number };

enum NodeType {
  J = "J",
  Q = "Q",
  K = "K",
}
export default function () {
  // const [installed, setInstalled] = useState(false);
  // const [connected, setConnected] = useState(false);
  // const [address, setAddress] = useState<string>();
  // TODO 重新处理connectWalletRef✔
  // const connectWalletRef = useRef<ConnectWallet_handleType>(null);
  const [num, setNum] = useState<number>(1);
  const [cost, setCost] = useState(0);
  const [nodeTotal, setNodeTotal] = useState(0);
  const [nodeRemaining, setNodeRemaining] = useState(0);

  const [userTotalBuy, setUserTotalBuy] = useState(0);

  const [nodeList, setNodeList] = useState<NodeInfo[]>([]);
  const [nodeInfo, setNodeInfo] = useState<NodeInfo>();

  const [selectNodeType, setSelectNodeType] = useState<string>("");
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  function getNodeInfo() {
    fetchUrl<NodeInfo[]>("/api/node/getNodeSetting", {
      method: "GET",
    }).then((res) => {
      if (res) {
        console.log(res.data);
        setNodeList([...res.data]);
        const nodeData = res.data[0];

        setSelectNodeType(nodeData.nodeName);
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
      }/subscribe/queryByWalletAddress?walletAddress=${user.wallet.address}`
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
    (async () => {
      if (user.wallet.payInfo.hash && user.wallet.address) {
        console.log("hash", user.wallet.payInfo.hash);
        // TODO 轮询购买是否成功✔
        let time = 0;
        async function checkSuccess(orderNumber: number): Promise<boolean> {
          time++;
          async function check() {
            // // 模拟轮询
            return new Promise<{ type: number } | undefined>(
              (reslove, reject) => {
                setTimeout(async () => {
                  let res = await API_PAY_NODE_SMS(
                    orderNumber,
                    user.wallet.payInfo.hash,
                    1
                  );
                  reslove(res);
                }, 2000);
              }
            );
          }

          let ok = await check();
          if (ok?.type == 1) return true;
          return checkSuccess(orderNumber);
        }
        // TODO 是否可以查到orderNumber？？
        let ok = await checkSuccess(user.wallet.payInfo.orderNumber);
        if (ok)
          CustomToast(
            "Paid, waiting for confirmation on the chain! Check it later in Personal Center."
          );
      }
    })();

    return () => {};
  }, [user.wallet.payInfo.hash]);

  function ActiveButton(
    props: { content: string; active: boolean; key?: any } & ButtonProps
  ) {
    return (
      <>
        <button
          key={props.key}
          onClick={props.onClick}
          className={`box-select-item active w-[33%] h-full ${
            props.active
              ? "text-[#F58C00] border-b-[#F58C00]"
              : "text-[#333] border-b-[#333333]"
          } flex border-solid justify-center items-center`}
        >
          <span className="uppercase">{props.content}</span>
        </button>
      </>
    );
  }
  return (
    <>
      {/* <Nav
        connectBtn={
          <ConnectWallet
            ref={connectWalletRef}
            onUpdate={(i, c, a) => {
              console.log(a);
              // setConnected(c);
              setInstalled(i);
              setAddress(a);
            }}
          />
        }
      /> */}
      <ScrollArea className="Participate">
        <div className="content flex flex-col">
          <div className="card bg-[#260217a1] m-0-auto flex ">
            <div className="left top relative">
              <div className="bulr-box absolute bg-[#260217] box-border border-solid border-[#f58c00]"></div>
              <div className="model flex justify-center items-center relative opacity-1 bg-[#260217] box-border border-solid border-[#f58c00]">
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
              </div>

              <div className="rightContent bottomContent w-full h-full box-border flex flex-col">
                <div className="boxselect w-full flex items-center">
                  {nodeList.map((v, i) => {
                    return (
                      <Fragment key={i}>
                        <ActiveButton
                          content={v.nodeName}
                          active={selectNodeType == v.nodeName}
                          onClick={() => {
                            setSelectNodeType(v.nodeName);
                            setNodeInfo(v);
                          }}
                        />
                      </Fragment>
                    );
                  })}
                </div>

                <ul className="priceDes w-full flex items-center">
                  <li className="flex flex-col items-center h-full justify-center">
                    <span className="uppercase text-[#EAEAEA]">price</span>
                    <div className="btcPrice flex items-baseline">
                      <span className="price text-[#EAEAEA]">
                        {nodeInfo?.nodePrice || "0.00"}
                      </span>
                      <span className="unit text-[#EAEAEA]">
                        &nbsp;&nbsp;BTC
                      </span>
                    </div>
                  </li>
                  <li className="flex flex-col items-center h-full justify-center">
                    <span className="uppercase text-[#EAEAEA]">Remaining</span>
                    <span className="text-[#EAEAEA]">
                      {nodeInfo?.nodeTotal || "0"}
                    </span>
                  </li>
                  <li className="flex flex-col items-center h-full justify-center">
                    <span className="uppercase text-[#EAEAEA]">
                      total amount
                    </span>
                    <span className="text-[#EAEAEA]">
                      {nodeInfo?.nodeTotal || "0"}
                    </span>
                  </li>
                </ul>

                <div className="content-bottom flex flex-col">
                  <span className="text-[#F58C00]">Box Rights</span>
                  <span className="text-[#EAEAEA]">
                    <p>·25% of platform tokens</p>
                    <p>
                      ·Permanently enjoy network gas fee dividends (the initial
                      proportion is as high as 70%, and with the development of
                      the ecosystem in the later period, the community will vote
                      to determine the redistribution proportion)
                    </p>
                    <p>·X% proportion of GAS fee airdrop activity</p>
                    rewards high weight voting rights
                    <p>
                      ·A series of other ecological development rights and
                      interests
                    </p>
                  </span>

                  <Button
                    className="buy-btn"
                    disabled={user.wallet.connected && nodeRemaining <= 0}
                    onClick={async () => {
                      if (!user.wallet.address) {
                        console.log(user.wallet.address);

                        // TODO 选择钱包弹窗✔
                        // connectWalletRef.current?._setWalletType(Wallet.OKX);
                        // connectWalletRef.current?._connect();
                        // connectWalletRef.current?._selectWallet();
                        dispatch(
                          SET_NOTIFICATION_TRIGGER_EVENT("SELECT_WALLET")
                        );

                        return;
                      }
                      if (typeof num === "number") {
                        if (!nodeInfo) return;
                        // TODO 购买节点✔
                        let orderInfo = await fetchUrl<
                          OrderInfo,
                          {
                            nodeId: number;
                            number: number;
                            tatolAmount: number;
                          }
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

                          // TODO 重新处理钱包发送交易
                          // let hash = await connectWalletRef.current?._onSubmit(
                          //   orderInfo.data.buyAmount,
                          //   "bc1p0xjywgpgdcy2ps5naqf4m44zkqptuejnk6226dwt0v3gcqv8alvqtppykk" // TODO 测试链接
                          // );

                          dispatch(
                            SET_PAY_INFO({
                              cost: orderInfo.data.buyAmount,
                              toAddress:
                                "bc1pendw5r63zdws68hg9pq3q7yprytkd08hfz84272gs22kaf6zgw7sq2gp5t",
                              hash: "",
                              orderNumber: orderInfo.data.orderNumber,
                            })
                          );
                          dispatch(
                            SET_NOTIFICATION_TRIGGER_EVENT("TRANSACTION")
                          );
                        }
                      }
                    }}
                  >
                    {!user.wallet.address
                      ? "Connent wallet"
                      : nodeRemaining > 0
                      ? "Buy Now"
                      : "Node Completed"}
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>

          <Invite />
        </div>
        <ConnectUs />
      </ScrollArea>
    </>
  );
}
