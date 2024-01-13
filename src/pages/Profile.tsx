import Invite from "@/components/common/Invite";
import roos_box from "@/assets/roos_box.png";
import flag from "@/assets/flag.png";
import "./Profile.scss";
import "./Profile-m.scss";
import { ScrollArea } from "@/components/ui/scroll-area";
import ConnectUs from "@/components/common/ConnectUs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { localStorageKey, shortenString } from "@/utils";
import { Fragment, useEffect, useState } from "react";
import {
  API_GET_CONTRIBUTION,
  API_GET_INVITE_VO_LIST,
  API_QUERY_BOX_USER_HAS_PURCHASED,
  BOX_USER_PURCHASED,
  CONTRIBUTION,
  INVITE_VO_LIST_ITEM,
} from "@/utils/api";
import { useAppSelector } from "@/store/hooks";
import { useNavigate } from "react-router-dom";
/*
 * @LastEditors: John
 * @Date: 2024-01-12 09:25:43
 * @LastEditTime: 2024-01-12 11:15:19
 * @Author: John
 */
export default function () {
  const [contributionDate, setContributionDate] = useState<CONTRIBUTION>();
  const [inviteList, setInviteList] = useState<INVITE_VO_LIST_ITEM[]>([]);
  const [userBox, setUserBox] = useState<BOX_USER_PURCHASED>();

  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("user.logInStatus", user.logInStatus);
    if (user.logInStatus == "LOG_OUT") return;
    (async () => {
      let userBox = await API_QUERY_BOX_USER_HAS_PURCHASED();
      setUserBox(userBox);
    })();

    (async () => {
      // TODO 获取用户CONTRIBUTION相关数据✔
      let contributionDate = await API_GET_CONTRIBUTION();
      setContributionDate(contributionDate);
    })();

    (async () => {
      // TODO 获取推荐人列表✔
      let inviteList = await API_GET_INVITE_VO_LIST();
      if (inviteList && inviteList.length > 0) setInviteList([...inviteList]);
    })();

    return () => {};
  }, [user.wallet.address, user.wallet.connected, user.logInStatus]);

  return (
    <>
      <ScrollArea className="Profile box-border">
        <div className="content box-border">
          <span className="title">MY BOX</span>
          <div className="roosBox flex items-center">
            <div className="left top">
              <img className="boxPng w-full h-full" src={roos_box} alt="" />
            </div>
            <div className="right bottom flex flex-col flex-auto">
              {userBox && !userBox.nodeName && (
                <>
                  <span className="Equity">
                    Get ROOSBOX,you can enjoy the following benefits.
                  </span>
                  <div
                    className="desBox"
                    // dangerouslySetInnerHTML={{ __html: userBox.illustrate }}
                  >
                    <p>·25% of platform tokens</p>
                    <p>
                      ·Permanently enjoy network gas fee dividends (the initial
                      proportion is as high as 70%, and with the development of
                      the ecosystem in the later period, the community will vote
                      to determine the redistribution proportion)
                    </p>
                    <p>
                      ·X% proportion of GAS fee airdrop activity rewards high
                      weight voting rights{" "}
                    </p>
                    <p>
                      ·A series of other ecological development rights and
                      interests
                    </p>
                  </div>
                  <button
                    className="getBoxBtn"
                    onClick={() => {
                      navigate("/participate");
                    }}
                  >
                    Get ROOSBOX
                  </button>
                </>
              )}

              {userBox && userBox.nodeName && (
                <>
                  <div className="boxNamePrice">
                    <span>{userBox?.nodeName}</span>
                    <span>{userBox?.buyAmount}</span>
                    <span>btc</span>
                  </div>
                  <span className="Equity">ROOSBOX Equity</span>
                  <div
                    className="desBox"
                    dangerouslySetInnerHTML={{ __html: userBox.illustrate }}
                  >
                    {/* <p>·25% of platform tokens</p>
                    <p>
                      ·Permanently enjoy network gas fee dividends (the initial
                      proportion is as high as 70%, and with the development of
                      the ecosystem in the later period, the community will vote
                      to determine the redistribution proportion)
                    </p>
                    <p>
                      {" "}
                      ·X% proportion of GAS fee airdrop activity rewards high
                      weight voting rights
                    </p>
                    <p>
                      {" "}
                      ·A series of other ecological development rights and
                      interests
                    </p> */}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="contribution flex flex-col justify-between">
            <span className="title">Contribution</span>
            <ul className="flex items-center w-full justify-between">
              <li className="flex flex-col items-center justify-between">
                <span>{contributionDate?.userNumber || 0}</span>
                <span>Invite ROOSBOX</span>
              </li>
              <li className="flex flex-col items-center justify-between">
                <span>{contributionDate?.contribution || 0}</span>
                <span>Contribution</span>
              </li>

              <li className="flex flex-col items-center justify-between">
                <div className="flex items-baseline">
                  <img src={flag} alt="" />
                  <span>x&nbsp;&nbsp;</span>
                  <span>{contributionDate?.nftNumer || 0}</span>
                </div>
                <span>NFT Fragments</span>
              </li>
            </ul>

            {inviteList.length > 0 && (
              <>
                <span className="title">Buy List</span>

                <Table className="buyList">
                  {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center uppercase text-[#999999] font-[Raleway-Medium]">
                        Rank
                      </TableHead>
                      <TableHead className="text-center uppercase text-[#999999] font-[Raleway-Medium]">
                        Address
                      </TableHead>
                      <TableHead className="text-center uppercase text-[#999999] font-[Raleway-Medium]">
                        ROOSBOX
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inviteList.map((v, i) => {
                      return (
                        <>
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
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </>
            )}
          </div>

          <Invite />
        </div>
        <ConnectUs />
      </ScrollArea>
    </>
  );
}
