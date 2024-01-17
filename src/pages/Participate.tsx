/*
 * @LastEditors: John
 * @Date: 2024-01-03 11:33:05
 * @LastEditTime: 2024-01-17 13:45:00
 * @Author: John
 */
import { Input } from "@/components/ui/input";
import "./Participate.scss";
import "./Participate-m.scss";
import { Button, ButtonProps } from "@/components/ui/button";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Wallet, fetchUrl, isMobile, isOKApp, localStorageKey } from "@/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import ConnectUs from "@/components/common/ConnectUs";
import CustomToast from "@/components/common/CustomToast";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import Invite from "@/components/common/Invite";
import { SET_NOTIFICATION_TRIGGER_EVENT, SET_PAY_INFO } from "@/store/reducer";
import { API_GET_NODE_LIST, API_PAY_NODE_SMS, NodeInfo } from "@/utils/api";
import boxT1 from "@/assets/boxT1.png";
import boxT2 from "@/assets/boxT2.png";
import boxT3 from "@/assets/boxT3.png";
import { useNavigate } from "react-router-dom";
import { CUSTOM_DIALOG } from "@/store/customCom";
type OrderInfo = {
  buyAmount: number;
  orderNumber: number;
  status: number;
  outAddress: string;
};
export default function () {
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
  const navigate = useNavigate();

  let remaining = useMemo(() => {
    if (nodeInfo) {
      return nodeInfo?.nodeTotal - nodeInfo?.purchasedCount;
    }
    return 0;
  }, [nodeInfo]);

  async function getNodeInfo() {
    let nodeList = await API_GET_NODE_LIST();

    console.log(nodeList);
    setNodeList([...nodeList]);
    const nodeData = nodeList[0];

    setSelectNodeType(nodeData.nodeName);
    setNodeInfo(nodeData);

    let nodeTotal = nodeData.nodeTotal;
    setNodeTotal(nodeTotal);
    setNodeRemaining(nodeTotal - nodeData.purchasedCount);
    setCost(nodeData.nodePrice);
  }

  useEffect(() => {
    // dispatch(
    //   CUSTOM_DIALOG({
    //     content:
    //       "Paid, waiting for confirmation on the chain! Check it later in Personal Center.",
    //   })
    // );
    getNodeInfo();
  }, []);

  useEffect(() => {
    (async () => {
      if (user.wallet.payInfo?.hash && user.wallet.address) {
        console.log("hash更新，去查询状态：", user.wallet.payInfo?.hash);
        let res = await API_PAY_NODE_SMS(
          user.wallet.payInfo.orderNumber,
          user.wallet.payInfo.hash,
          1
        );
        if (res.type == 1) {
          dispatch(
            CUSTOM_DIALOG({
              content:
                "Paid, waiting for confirmation on the chain! Check out later on MY JOURNEY",
            })
          );
          // // TODO 查询用户邀请码✔
          // let invitationCode = await API_CHECK_INVITE_CODE();
          // if (invitationCode)
          //   dispatch(SET_USER_INVITATION_CODE(invitationCode));
          // navigate("/profile");
        } else {
          CustomToast(
            "The payment failed and the transaction may have been declined!"
          );
        }

        dispatch(SET_PAY_INFO(null));
      }
    })();

    return () => {};
  }, [user.wallet.payInfo?.hash]);

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
              : "text-[#333] border-b-[#380522]"
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
          <div className="card m-0-auto flex ">
            <div className="left top relative">
              <div className="bulr-box absolute box-border border-solid"></div>
              <div className="model flex justify-center items-center relative opacity-1 box-border border-solid">
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

                {nodeInfo?.nodeName == "T1" && (
                  <img className="h-full" src={boxT1} alt="" />
                )}
                {nodeInfo?.nodeName == "T2" && (
                  <img className="h-full" src={boxT2} alt="" />
                )}
                {nodeInfo?.nodeName == "T3" && (
                  <img className="h-full" src={boxT3} alt="" />
                )}
              </div>
            </div>

            <div className="right bottom">
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
                  <span>Currently 1 node {cost} BTC</span>
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
                    <span className="uppercase text-[#D5D5D5] opacity-60">
                      price
                    </span>
                    <div className="btcPrice flex items-baseline">
                      <span className="price text-[#EAEAEA]">
                        {nodeInfo?.nodePrice || "0.00"}
                      </span>
                      <span className="unit text-[#EAEAEA]">
                        &nbsp;&nbsp;BTC
                      </span>
                    </div>
                  </li>
                  <div className="line"></div>
                  <li className="flex flex-col items-center h-full justify-center">
                    <span className="uppercase text-[#D5D5D5] opacity-60">
                      Remaining
                    </span>
                    <span className="text-[#EAEAEA]">{remaining}</span>
                  </li>
                  <div className="line"></div>
                  <li className="flex flex-col items-center h-full justify-center">
                    <span className="uppercase text-[#D5D5D5] opacity-60">
                      TOTAL SUPPLY
                    </span>
                    <span className="text-[#EAEAEA]">
                      {nodeInfo?.nodeTotal || "0"}
                    </span>
                  </li>
                </ul>

                <div className="content-bottom flex flex-col flex-auto">
                  <span className="text-[#F58C00]">Intro To RoosBOX</span>
                  <div
                    className="rightsAndInterests text-[#EAEAEA]"
                    dangerouslySetInnerHTML={{
                      __html: nodeInfo?.illustrate || "",
                    }}
                  >
                    {/* <p>·25% of platform tokens</p>
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
                    </p> */}
                  </div>

                  <Button
                    className="buy-btn mt-auto"
                    disabled={user.wallet.connected && nodeRemaining <= 0}
                    onClick={async () => {
                      if (!user.wallet.address) {
                        console.log(user.wallet.address);

                        // TODO 选择钱包弹窗✔
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

                          // TODO 重新处理钱包发送交易✔
                          // let hash = await connectWalletRef.current?._onSubmit(
                          //   orderInfo.data.buyAmount,
                          //   "bc1p0xjywgpgdcy2ps5naqf4m44zkqptuejnk6226dwt0v3gcqv8alvqtppykk"
                          // );

                          dispatch(
                            SET_PAY_INFO({
                              cost: orderInfo.data.buyAmount,
                              toAddress: orderInfo.data.outAddress,
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
            </div>
          </div>

          <Invite />
        </div>
        <ConnectUs />
      </ScrollArea>
    </>
  );
}
