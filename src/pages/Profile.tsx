/*
 * @LastEditors: John
 * @Date: 2024-01-12 09:25:43
 * @LastEditTime: 2024-02-27 17:35:40
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
  API_GET_W_ORD_NODE_PRO,
  API_QUERY_BOX_USER_HAS_PURCHASED,
  API_REFERRAL_REWARD,
  API_TEAM_LIST,
  BOX_USER_PURCHASED,
  CONTRIBUTION,
  INVITE_VO_LIST_ITEM,
  NodeInfo,
  REFERRAL_REWARD,
  TEAM_LIST_ITEM,
  W_ORD_NODE_PRO_ITEM,
} from "@/utils/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useNavigate } from "react-router-dom";
import { SET_USER_INVITATION_CODE } from "@/store/reducer";
import { CUSTOM_DIALOG } from "@/store/customCom";
import boxT1 from "@/assets/boxT1.png";
import boxT2 from "@/assets/boxT2.png";
import boxT3 from "@/assets/boxT3.png";
import myBoxListItem from "@/assets/myBoxListItem.png";
import NftsAccessories from "./ProfileCom/NftsAccessories";
import MiningMachine from "./ProfileCom/MiningMachine";
import Machine from "./ProfileCom/Machine";
import Recommend from "./ProfileCom/Recommend";
import CompletionList from "./ProfileCom/CompletionList";
import GetNftBox from "./ProfileCom/GetNftBox";
import CustomToast from "@/components/common/CustomToast";

export default function () {
  const [contributionDate, setContributionDate] = useState<CONTRIBUTION>();
  const [inviteList, setInviteList] = useState<INVITE_VO_LIST_ITEM[]>([]);
  const [userBox, setUserBox] = useState<BOX_USER_PURCHASED>();
  const [T3nodeInfo, setT3NodeInfo] = useState<NodeInfo>();
  const [nodeInfo, setNodeInfo] = useState<NodeInfo>();

  const [currentNav, setCurrentNav] = useState(0);
  const [referralReward, setReferralReward] = useState<REFERRAL_REWARD>();
  const [teamList, setTeamList] = useState<TEAM_LIST_ITEM[]>([]);
  const [myBoxList, setMyBoxList] = useState<W_ORD_NODE_PRO_ITEM[]>([]);
  const [currentTeamLev, setcurrentTeamLev] = useState<1 | 2>(1);

  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log("user.logInStatus", user.logInStatus);
    if (user.logInStatus == "LOG_OUT") return;
    (async () => {
      return; // 废弃
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
      return; // 废弃
      // TODO 获取用户CONTRIBUTION相关数据✔
      let contributionDate = await API_GET_CONTRIBUTION();
      setContributionDate(contributionDate);
    })();

    (async () => {
      return; // 废弃
      // TODO 获取推荐人列表✔
      let inviteList = await API_GET_INVITE_VO_LIST();
      if (inviteList && inviteList.length > 0) {
        setInviteList([...inviteList]);
      } else {
        setInviteList([]);
      }
    })();

    (async () => {
      setReferralReward(await API_REFERRAL_REWARD());
    })();

    (async () => {
      changeList([1]);
    })();

    (async () => {
      setMyBoxList(await API_GET_W_ORD_NODE_PRO());
    })();

    return () => {};
  }, [user.wallet.address, user.wallet.connected, user.logInStatus]);

  useEffect(() => {
    (async () => {
      let nodeList = await API_GET_NODE_LIST();
      setT3NodeInfo(nodeList[2]);
      setNodeInfo(nodeList[0]);
    })();
  }, []);

  async function changeList(grade: Parameters<typeof API_TEAM_LIST>) {
    setTeamList(await API_TEAM_LIST(grade[0]));
  }

  return (
    <>
      <div className="Profile">
        <>
          <ul className="nav">
            <li
              className={currentNav == 0 ? "active" : ""}
              onClick={() => setCurrentNav(0)}
            >
              My KeyBOX
            </li>
            <li
              className={currentNav == 1 ? "active" : ""}
              onClick={() => setCurrentNav(1)}
            >
              Referral Rewards
            </li>
            <li
              className={currentNav == 2 ? "active" : ""}
              onClick={() => setCurrentNav(2)}
            >
              NFT Key Accessory
            </li>
            <li
              className={currentNav == 3 ? "active" : ""}
              // onClick={() => setCurrentNav(3)}
              onClick={() => CustomToast("coming soon")}
            >
              EcoWave Points
            </li>
          </ul>
          <ScrollArea className="content_scroll box-border">
            <div className="content box-border">
              {currentNav == 0 && (
                <>
                  {myBoxList.length > 0 ? (
                    <ul className="myNodeBox">
                      {myBoxList.map((v, i) => (
                        <li key={i} className="boxItem">
                          <img src={myBoxListItem} alt="" />
                          <div className="boxDes">
                            <span>{v.nodeName}</span>
                            <span>#{v.id}</span>
                          </div>

                          <div className="count">
                            <span>Token Reward</span>
                            <span>38000&nbsp;ROS</span>
                          </div>
                        </li>
                      ))}
                      {/* {Array.from({ length: 20 }).map((v, i) => (
                        <li key={i} className="boxItem">
                          <img src={myBoxListItem} alt="" />
                          <div className="boxDes">
                            <span>Box</span>
                            <span>123</span>
                          </div>

                          <div className="count">
                            <span>Token Reward</span>
                            <span>38000&nbsp;ROS</span>
                          </div>
                        </li>
                      ))} */}
                    </ul>
                  ) : (
                    <>
                      {/* 页面3 */}
                      <div className="getNftBox box-border">
                        {/* <div className="GetNftsContainer"> */}
                        <GetNftBox />
                        {/* </div> */}
                      </div>
                    </>
                  )}
                </>
              )}

              {currentNav == 1 && (
                <div className="referralRewards">
                  <Invite className="Profile-invite" />
                  <span className="title">Team Contribution</span>
                  <ul className="recommendation">
                    <li className="item">
                      <span className="num">
                        {referralReward?.oneNftAmount || "-"}
                      </span>
                      <span className="text">LEV1 KEYBOXS</span>
                    </li>
                    <li className="item">
                      <span className="num">
                        {referralReward?.twoNftAmount || "-"}
                      </span>
                      <span className="text">LEV2 KEYBOXS</span>
                    </li>
                    <li className="item">
                      <span className="num">
                        {referralReward?.bitAmount || "-"}
                      </span>
                      <span className="text">GASBIT POINTS</span>
                    </li>
                    <li className="item">
                      <span className="num">
                        {referralReward?.usdtAmount || "-"}
                      </span>
                      <span className="text">USDT Rebat</span>
                    </li>
                  </ul>
                  <div className="teamTab title flex items-center">
                    <span
                      className={`cursor-pointer ${
                        currentTeamLev == 1 ? "active" : ""
                      }`}
                      onClick={() => {
                        setcurrentTeamLev(1);
                        changeList([1]);
                      }}
                    >
                      Level1 Team Member
                    </span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <span
                      className={`cursor-pointer ${
                        currentTeamLev == 2 ? "active" : ""
                      }`}
                      onClick={() => {
                        setcurrentTeamLev(2);
                        changeList([2]);
                      }}
                    >
                      Level2 Team Member
                    </span>
                  </div>

                  <div className="STYLE_CUSTOM_TABLE">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center uppercase text-[#999999] font-[Raleway-Medium]">
                            Rank
                          </TableHead>
                          <TableHead className="text-center uppercase text-[#999999] font-[Raleway-Medium]">
                            Address
                          </TableHead>
                          <TableHead className="text-center uppercase text-[#999999] font-[Raleway-Medium]">
                            Quantity
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teamList.map((v, i) => {
                          return (
                            <Fragment key={i}>
                              <TableRow>
                                <TableCell className="text-center text-[#EAEAEA] font-[DINPRO-MEDIUM]">
                                  {i + 1}
                                </TableCell>
                                <TableCell className="text-center text-[#EAEAEA] font-[DINPRO-MEDIUM]">
                                  {shortenString(v.address, 6, 5)}
                                </TableCell>
                                <TableCell className="text-center text-[#EAEAEA] font-[DINPRO-MEDIUM]">
                                  {v.number}
                                </TableCell>
                              </TableRow>
                            </Fragment>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {currentNav == 2 && (
                <div className="nftAccessories box-border">
                  <div className="accessoriesContainer">
                    <p className="title">My BTCStorage Trailblazer Keys</p>
                    <div className="header">
                      <div className="accessories">
                        <NftsAccessories />
                      </div>
                      <div className="mining">
                        <span className="text-[#F58C00]">
                          {/* {nodeInfo?.title} */}
                          Synthesis Rules And Functions
                        </span>
                        <div
                          className="rightsAndInterests text-[#EAEAEA]"
                          // dangerouslySetInnerHTML={{
                          //   __html: nodeInfo?.illustrate || "",
                          // }}
                        >
                          Holding one KeyBOX entitles you to 10 BTCStorage
                          Trailblazer Keys. Combining 10 Keys can create a
                          "Bitcoin Modular NFT," which unlocks various scenarios
                          and benefits, and can be directly traded on the
                          secondary NFT market. The trading of Modular NFTs will
                          commence during the testnet phase, with specific
                          timing to be announced later.
                        </div>
                        {/* <MiningMachine /> */}
                      </div>
                    </div>
                  </div>
                  {/* <div className="MachineContainer">
                    <p className="title">My mining machine</p>
                    <Machine />
                  </div> */}
                </div>
              )}

              {currentNav == 3 && (
                <div className="odysseyPoints box-border">
                  <div className="recommendationContainer">
                    <p className="title">My recommendation</p>
                    <Recommend />
                  </div>
                  <div className="completionListContainer">
                    <p className="title">Odyssey recommended completion list</p>
                    <CompletionList />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </>
      </div>
    </>
  );
}
