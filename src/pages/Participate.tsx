/*
 * @LastEditors: John
 * @Date: 2024-01-03 11:33:05
 * @LastEditTime: 2024-03-05 17:22:24
 * @Author: John
 */
import { Input } from "@/components/ui/input";
import "./Participate.scss";
import "./Participate-m.scss";
import { Button, ButtonProps } from "@/components/ui/button";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  Wallet,
  fetchUrl,
  isMobile,
  isOKApp,
  localStorageKey,
  shortenString,
} from "@/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import ConnectUs from "@/components/common/ConnectUs";
import CustomToast from "@/components/common/CustomToast";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import Invite from "@/components/common/Invite";
import {
  SET_BUY_LOADING,
  SET_NOTIFICATION_TRIGGER_EVENT,
  SET_PAY_INFO,
} from "@/store/reducer";
import {
  API_GET_NODE_LIST,
  API_GET_ORDER_STATE_BY_HASH,
  API_PAY_NODE_SMS,
  NodeInfo,
} from "@/utils/api";
import boxT1 from "@/assets/boxT1.png";
import boxT2 from "@/assets/boxT2.png";
import boxT3 from "@/assets/boxT3.png";
import participate_box from "@/assets/participate_box.png";
import { useNavigate } from "react-router-dom";
import { CUSTOM_DIALOG, SET_CUSTOM_DIALOG_OPEN } from "@/store/customCom";
import ReduceAddInput from "@/components/common/ReduceAddInput";
import Iconfont from "@/components/iconfont";
type OrderInfo = {
  buyAmount: string;
  buyCount: number;
  orderNumber: number;
  status: number;
  outAddress: string;
  address: string; // 上级地址 (数字)
  num: number; // 随机数
  rebateRatio: number; // 返佣比例
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

  const { buyNftIds, startPollingCheckBuyStatus, stopPollingCheckBuyStatus } =
    usePollingCheckBuyStatus();

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
    const hash = user.wallet.payInfo?.hash;
    if (!hash) return;
    if (buyNftIds == null) {
      // 确认中
      dispatch(
        CUSTOM_DIALOG({
          content: "Please wait in Mint",
          cannotClose: true,
          loading: true,
          hash: `Txn: ${shortenString(hash, 7, 7)}`,
          clickHashCallBack: () => {
            window.open(
              `${import.meta.env.VITE_CHECK_TRANSACTION_DETAILS_URL}${hash}`
            );
          },
        })
      );
    } else if (buyNftIds === "0") {
      // 失败
      dispatch(
        CUSTOM_DIALOG({
          content: "Mint failed",
          hash: `Txn: ${shortenString(hash, 7, 7)}`,
          showConfirmBtn: true,
        })
      );
      dispatch(SET_PAY_INFO(null));
      stopPollingCheckBuyStatus();
    } else {
      // 成功
      dispatch(
        CUSTOM_DIALOG({
          content: "Mint is successful",
          hash: `Your KeyBOX ${buyNftIds}`,
          showConfirmBtn: true,
          confirmBtnText: "Check My keyBOX",
          confirmBtnCallBack: () => navigate("/profile"),
        })
      );
      dispatch(SET_PAY_INFO(null));
      stopPollingCheckBuyStatus();
    }

    dispatch(SET_BUY_LOADING(false));
    return () => {};
  }, [buyNftIds, user.wallet.payInfo?.hash]);

  useEffect(() => {
    getNodeInfo();
  }, []);

  useEffect(() => {
    (async () => {
      if (user.wallet.payInfo?.hash && user.wallet.address) {
        console.log("hash更新，去查询状态：", user.wallet.payInfo.hash);
        let res = await API_PAY_NODE_SMS(
          user.wallet.payInfo.orderNumber,
          user.wallet.payInfo.hash,
          1
        );
        if (res.type == 1) {
          //TODO 支付后的状态轮询
          // dispatch(
          //   CUSTOM_DIALOG({
          //     content:
          //       "Paid, waiting for confirmation on the chain! Check out later on MY JOURNEY",
          //   })
          // );
          startPollingCheckBuyStatus(user.wallet.payInfo.hash);
        } else {
          CustomToast(
            "The payment failed and the transaction may have been declined!"
          );
        }
      }
    })();

    return () => {};
  }, [user.wallet.payInfo?.hash]);

  useEffect(() => {
    if (user.buyLoading) {
      dispatch(
        CUSTOM_DIALOG({
          content: "During payment, please do not exit or switch interfaces",
          cannotClose: true,
          loading: true,
        })
      );
    } else {
      dispatch(SET_CUSTOM_DIALOG_OPEN(false));
    }
    return () => {};
  }, [user.buyLoading]);

  function ActiveButton(
    props: { content: string; active: boolean; key?: any } & ButtonProps
  ) {
    return (
      <>
        <button
          key={props.key}
          onClick={props.onClick}
          className={`box-select-item active h-full ${
            props.active
              ? "text-[#F58C00] border-b-[#F58C00]"
              : "text-[#333] border-b-[#380522]"
          } flex border-solid justify-center items-center flex-1`}
        >
          <span>{props.content}</span>
        </button>
      </>
    );
  }
  return (
    <>
      <ScrollArea className="Participate bg-[#232323]">
        <div className="content flex flex-col">
          <div className="card m-0-auto">
            <div className="left top relative">
              <div className="bulr-box absolute box-border border-solid"></div>
              <div className="model flex flex-col relative opacity-1 box-border border-solid">
                {/* !isMobile && !isOKApp && */}
                {/* <span className="box_title">ROOSBOX</span> */}

                {/* {nodeInfo?.id == 145 && <img src={boxT1} alt="" />}
                {nodeInfo?.id == 2 && <img src={boxT2} alt="" />}
                {nodeInfo?.id == 3 && <img src={boxT3} alt="" />} */}
                <div className="boxBg"></div>
                {/* <div className="boxFornt"></div> */}
                <img src={participate_box} alt="" />
              </div>
            </div>

            <div className="right bottom">
              <div className="rightContent bottomContent w-full h-full box-border flex flex-col">
                <div className="top_box bg-[#0c0907]">
                  <div className="boxselect w-full flex items-center justify-between">
                    {nodeList.map((v, i) => {
                      return (
                        <Fragment key={i}>
                          <ActiveButton
                            content={v.nodeName}
                            active={selectNodeType == v.nodeName}
                            onClick={() => {
                              if (v.status == 3) {
                                CustomToast("Coming soon");
                                return;
                              }
                              setSelectNodeType(v.nodeName);
                              setNodeInfo(v);
                            }}
                          />
                        </Fragment>
                      );
                    })}
                  </div>

                  <ul className="priceDes w-full flex items-center">
                    <li className="flex flex-col h-full justify-center items-center">
                      <span className="uppercase text-[#D5D5D5] opacity-60">
                        price
                      </span>
                      <div className="btcPrice flex items-baseline">
                        <span className="price text-[#EAEAEA]">
                          {nodeInfo?.nodePrice || "0.00"}
                        </span>
                        <span className="unit text-[#EAEAEA]">
                          &nbsp;&nbsp;{nodeInfo?.buyCoinName}
                        </span>
                      </div>
                    </li>

                    <li className="flex flex-col h-full justify-center items-center">
                      <span className="uppercase text-[#D5D5D5] opacity-60">
                        Remaining
                      </span>
                      <span className="Remaining">
                        {(nodeInfo?.nodeTotal || 0) -
                          (nodeInfo?.purchasedCount || 0)}
                      </span>
                    </li>

                    <li className="flex flex-col h-full justify-center items-center">
                      <span className="uppercase text-[#D5D5D5] opacity-60">
                        total amount
                      </span>
                      <span className="totalAmount">
                        {nodeInfo?.nodeTotal || 0}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="content-bottom flex flex-col flex-auto">
                  <span className="text-[#F58C00]">{nodeInfo?.title}</span>
                  <div
                    className="rightsAndInterests text-[#EAEAEA]"
                    dangerouslySetInnerHTML={{
                      __html: nodeInfo?.illustrate || "",
                    }}
                  ></div>

                  <ReduceAddInput
                    disable={user.buyLoading}
                    onChange={(val) => setNum(val)}
                  />

                  <div className="totalCost flex items-center ml-auto">
                    <span>Cost:&nbsp;&nbsp;</span>
                    <span>
                      {num * cost}&nbsp;{nodeInfo?.buyCoinName}
                    </span>
                  </div>

                  <Button
                    className={`buy-btn mt-auto ${
                      user.buyLoading ? "cursor-not-allowed" : ""
                    }`}
                    disabled={
                      user.wallet.connected &&
                      nodeRemaining <= 0 &&
                      user.buyLoading
                    }
                    onClick={async () => {
                      if (!user.wallet.address) {
                        console.log(user.wallet.address);

                        // TODO 选择钱包弹窗✔
                        dispatch(
                          SET_NOTIFICATION_TRIGGER_EVENT("SELECT_WALLET")
                        );

                        return;
                      }
                      if (user.wallet.chainType == "BTC") {
                        CustomToast("MINT Please Switch To Etherscan Wallet !");
                        return;
                      }

                      if (user.buyLoading) return;

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
                          if (user.wallet.payInfo && isOKApp) {
                            // 检测是否存在之前的订单，有则取消订单（在okxapp中特殊处理）
                            await API_PAY_NODE_SMS(
                              user.wallet.payInfo.orderNumber,
                              "123456789",
                              2
                            );
                            dispatch(SET_PAY_INFO(null));
                          }

                          dispatch(
                            SET_PAY_INFO({
                              buyAmount: orderInfo.data.buyAmount,
                              buyCount: orderInfo.data.buyCount,
                              toAddress: orderInfo.data.outAddress,
                              hash: "",
                              orderNumber: orderInfo.data.orderNumber,

                              address: orderInfo.data.address,
                              num: orderInfo.data.num,
                              rebateRatio: orderInfo.data.rebateRatio,
                            })
                          );
                          dispatch(
                            SET_NOTIFICATION_TRIGGER_EVENT("TRANSACTION")
                          );
                        }
                      }
                    }}
                  >
                    {user.buyLoading && (
                      <Iconfont
                        name="jiazai"
                        className="loadingIcon"
                        color="#333333"
                      />
                    )}
                    {!user.wallet.address
                      ? "Connent wallet"
                      : nodeRemaining > 0
                      ? // ? "Buy Now"
                        "Mint"
                      : "Node Completed"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Invite className="Participate-invite" />
        </div>
        {/* <ConnectUs /> */}
      </ScrollArea>
    </>
  );
}

function usePollingCheckBuyStatus() {
  const [buyNftIds, setBuyNftIds] = useState<string | null>();
  const stop = useRef(false);

  function startPollingCheckBuyStatus(hash: string) {
    polling(hash);
  }

  const checkStatus = async (hash: string) => {
    return new Promise<void>(async (reslove, reject) => {
      let res = await API_GET_ORDER_STATE_BY_HASH(hash);
      setBuyNftIds(res.nftIds);
      console.log("得到nft ids:", res.nftIds);
      setTimeout(() => {
        reslove();
      }, 2000);
    });
  };

  const polling = async (hash: string) => {
    await checkStatus(hash);
    if (stop.current) return;
    polling(hash);
  };

  function stopPollingCheckBuyStatus() {
    stop.current = true;
  }

  return {
    buyNftIds,
    startPollingCheckBuyStatus,
    stopPollingCheckBuyStatus,
  };
}
