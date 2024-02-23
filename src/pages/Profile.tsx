/*
 * @LastEditors: John
 * @Date: 2024-01-12 09:25:43
 * @LastEditTime: 2024-02-23 14:57:15
 * @Author: John
 */
import "./Profile-m.scss";
import "./Profile.scss";
import Invite from "@/components/common/Invite";
import roos_box from "@/assets/roos_box.png";
import flag from "@/assets/flag.png";
import { ScrollArea } from "@/components/ui/scroll-area";
import ConnectUs from "@/components/common/ConnectUs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { localStorageKey, shortenString } from "@/utils";
import { Fragment, useEffect, useState } from "react";
import {
  API_CHECK_INVITE_CODE,
  API_GET_CONTRIBUTION,
  API_GET_INVITE_VO_LIST,
  API_GET_NODE_LIST,
  API_QUERY_BOX_USER_HAS_PURCHASED,
  BOX_USER_PURCHASED,
  CONTRIBUTION,
  INVITE_VO_LIST_ITEM,
  NodeInfo,
} from "@/utils/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useNavigate } from "react-router-dom";
import { SET_USER_INVITATION_CODE } from "@/store/reducer";
import { CUSTOM_DIALOG } from "@/store/customCom";
import boxT1 from "@/assets/boxT1.png";
import boxT2 from "@/assets/boxT2.png";
import boxT3 from "@/assets/boxT3.png";

export default function () {
  const [contributionDate, setContributionDate] = useState<CONTRIBUTION>();
  const [inviteList, setInviteList] = useState<INVITE_VO_LIST_ITEM[]>([]);
  const [userBox, setUserBox] = useState<BOX_USER_PURCHASED>();
  const [T3nodeInfo, setT3NodeInfo] = useState<NodeInfo>();

  const [currentNav, setCurrentNav] = useState(0);

  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log("user.logInStatus", user.logInStatus);
    if (user.logInStatus == "LOG_OUT") return;
    (async () => {
      let userBox = await API_QUERY_BOX_USER_HAS_PURCHASED();
      // TODO 判断用户正在购买的盒子的支付状态，如果支付未完成，提示等待
      // CUSTOM_DIALOG({
      //   content:
      //     "Paid, waiting for confirmation on the chain! Check it later in Personal Center.",
      // });
      setUserBox({
        buyAmount: userBox.buyAmount,
        illustrate: userBox.illustrate,
        nodeName: userBox.nodeName,
        status: userBox.status,
      });

      if (userBox.status == 1) {
        // TODO 查询用户邀请码✔
        let invitationCode = await API_CHECK_INVITE_CODE();
        if (invitationCode) dispatch(SET_USER_INVITATION_CODE(invitationCode));
      } else if (userBox.status == 2) {
        // TODO 支付未完成，提示等待✔
        dispatch(
          CUSTOM_DIALOG({
            content: "Please wait, it is being confirmed on the chain! ",
          })
        );
      }
    })();

    (async () => {
      // TODO 获取用户CONTRIBUTION相关数据✔
      let contributionDate = await API_GET_CONTRIBUTION();
      setContributionDate(contributionDate);
    })();

    (async () => {
      // TODO 获取推荐人列表✔
      let inviteList = await API_GET_INVITE_VO_LIST();
      if (inviteList && inviteList.length > 0) {
        setInviteList([...inviteList]);
      } else {
        setInviteList([]);
      }
    })();

    return () => {};
  }, [user.wallet.address, user.wallet.connected, user.logInStatus]);

  useEffect(() => {
    (async () => {
      let nodeList = await API_GET_NODE_LIST();
      setT3NodeInfo(nodeList[2]);
    })();
  }, []);

  return (
    <>
      <div className="Profile">
        <ul className="nav">
          <li
            className={currentNav == 0 ? "active" : ""}
            onClick={() => setCurrentNav(0)}
          >
            my node box
          </li>
          <li
            className={currentNav == 1 ? "active" : ""}
            onClick={() => setCurrentNav(1)}
          >
            Referral rewards
          </li>
          <li
            className={currentNav == 2 ? "active" : ""}
            onClick={() => setCurrentNav(2)}
          >
            NFT accessories
          </li>
          <li
            className={currentNav == 3 ? "active" : ""}
            onClick={() => setCurrentNav(3)}
          >
            Odyssey Points
          </li>
        </ul>
        <ScrollArea className="content_scroll box-border">
          <div className="content box-border">
            {currentNav == 0 && (
              <ul className="myNodeBox">
                {Array.from({ length: 50 }).map((v, i) => (
                  <li key={i} className="boxItem">
                    <img src="" alt="" />
                    <div className="boxDes">
                      <span>ROOS NODEBOX</span>
                      <span>#3756</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {currentNav == 1 && (
              <div className="referralRewards">
                <Invite />
                <span className="title">My recommendation</span>
                <ul className="recommendation">
                  <li className="item">
                    <span className="num">10</span>
                    <span className="text">Leve1 NFTs</span>
                  </li>
                  <li className="item">
                    <span className="num">10</span>
                    <span className="text">Leve2 NFTs</span>
                  </li>
                  <li className="item">
                    <span className="num">100</span>
                    <span className="text">RBIT Points</span>
                  </li>
                  <li className="item">
                    <span className="num">300</span>
                    <span className="text">Back USDT</span>
                  </li>
                </ul>
                <span className="title">Leve 1 Team Levl 2 Team</span>

                <Table className="rankList">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center uppercase text-[#999999] font-[Raleway-Medium]">
                        Rank
                      </TableHead>
                      <TableHead className="text-center uppercase text-[#999999] font-[Raleway-Medium]">
                        Address
                      </TableHead>
                      <TableHead className="text-center uppercase text-[#999999] font-[Raleway-Medium]">
                        NFTs
                      </TableHead>
                      <TableHead className="text-center uppercase text-[#999999] font-[Raleway-Medium]">
                        Quantity
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* {inviteList.map((v, i) => {
                      return (
                        <Fragment key={i}>
                          <TableRow>
                            <TableCell className="text-center text-[#EAEAEA]">
                              {i + 1}
                            </TableCell>
                            <TableCell className="text-center text-[#EAEAEA]">
                              {shortenString(v.address, 6, 5)}
                            </TableCell>
                            <TableCell className="text-center text-[#EAEAEA]">
                              {v.nodeName}
                            </TableCell>
                          </TableRow>
                        </Fragment>
                      );
                    })} */}

                    {Array.from({ length: 50 }).map((v, i) => {
                      return (
                        <Fragment key={i}>
                          <TableRow>
                            <TableCell className="text-center text-[#EAEAEA]">
                              {i + 1}
                            </TableCell>
                            <TableCell className="text-center text-[#EAEAEA]">
                              {/* {shortenString(v.address, 6, 5)} */}
                              0x2323...W313
                            </TableCell>
                            <TableCell className="text-center text-[#EAEAEA]">
                              T1
                            </TableCell>
                            <TableCell className="text-center text-[#EAEAEA]">
                              1
                            </TableCell>
                          </TableRow>
                        </Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
