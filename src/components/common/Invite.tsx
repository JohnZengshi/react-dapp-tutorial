/*
 * @LastEditors: John
 * @Date: 2024-01-12 09:59:21
 * @LastEditTime: 2024-02-22 14:13:01
 * @Author: John
 */
import "./Invite.scss";
import "./Invite-m.scss";
import roos_logo from "@/assets/roos_logo.png";
import copy from "@/assets/copy.png";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import roos_logo_big from "@/assets/roos_logo_big.png";
import { Fragment, useEffect, useState } from "react";
import {
  API_CHECK_INVITE_CODE,
  API_GET_NODE_LIST,
  NodeInfo,
} from "@/utils/api";
import { UrlQueryParamsKey, shortenString } from "@/utils";
import CustomToast from "./CustomToast";
import { SET_USER_INVITATION_CODE } from "@/store/reducer";
import * as clipboard from "clipboard-polyfill";

export default function () {
  const invitationCode = useAppSelector(
    (state) => state.user.wallet.invitationCode
  );
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [nodeList, setNodeList] = useState<NodeInfo[]>([]);

  useEffect(() => {
    (async () => {
      let nodeList = await API_GET_NODE_LIST();
      setNodeList([...nodeList]);
    })();

    return () => {};
  }, []);

  useEffect(() => {
    if (user.logInStatus == "LOG_OUT") return;
    (async () => {
      // TODO 查询用户邀请码✔
      let invitationCode = await API_CHECK_INVITE_CODE();
      if (invitationCode) {
        dispatch(SET_USER_INVITATION_CODE(invitationCode));
      } else {
        dispatch(SET_USER_INVITATION_CODE(""));
      }
    })();
  }, [user.logInStatus]);

  // function updateInviteCode(logInStatus: typeof user.logInStatus) {

  // }

  return (
    <>
      <div className="invite relative bg-[#26021798] box-border border-solid border-[rgb(245, 140, 0)] flex flex-col overflow-hidden">
        <img className="logo" src={roos_logo} alt="" />
        <span className="font-[Raleway-Bold] uppercase tracking-[0em] text-[#F58C00]">
          Get Rewards Through Referral
        </span>
        {/* <span className="font-[Raleway-Medium] text-[#EAEAEA]"> */}
        {/* {user.wallet.connected && invitationCode && ( */}
        {/* <>
            ·Invite the box to get contribution,{" "}
            {nodeList.map((v, i) => {
              return (
                <Fragment key={i}>
                  {v.nodeName} rewards {v.contribution}{" "}
                  {i === nodeList.length - 1 ? "." : ","}{" "}
                </Fragment>
              );
            })}
          </> */}
        {/* )} */}
        {/* </span> */}
        {/* <span className="font-[Raleway-Medium] text-[#EAEAEA]"> */}
        {/* {user.wallet.connected && invitationCode && ( */}
        {/* <>
            ·Invite the box to get NFT fragments,{" "}
            {nodeList.map((v, i) => {
              return (
                <Fragment key={i}>
                  {v.nodeName} rewards {v.nftNumber}{" "}
                  {i === nodeList.length - 1 ? "." : ","}{" "}
                </Fragment>
              );
            })}
          </> */}
        {/* )} */}
        {/* </span> */}
        <span className="font-[Raleway-Medium] text-[#EAEAEA]">
          Buy RoosBOX to obtain your referral code and share your referral code
          with others to get referral rewards.
        </span>
        {!user.wallet.connected && (
          <span className="font-[Raleway-Medium] text-[#F58C00]">
            <>Connect wallet to receive invitation link.</>
          </span>
        )}
        {user.wallet.connected && !invitationCode && (
          <span className="font-[Raleway-Medium] text-[#F58C00]">
            <>Purchase ROOSBOX to get invitation link.</>
          </span>
        )}
        {user.wallet.connected && invitationCode && (
          <div className="invite-bottom flex z-[2]">
            <div className="flex items-center">
              <span className="font-[Raleway-Medium] text-[#EAEAEA]">
                Link：
              </span>
              <span className="font-[Raleway-Medium] text-[#F58C00] underline">
                {user.wallet.connected && invitationCode && (
                  // TODO 邀请连接需要动态生成
                  <>
                    {shortenString(
                      `${import.meta.env.VITE_BASE_URL}/#/participate?${
                        UrlQueryParamsKey.INVITE_CODE
                      }=${invitationCode}`,
                      15,
                      15
                    )}
                  </>
                )}

                {/* {!user.wallet.connected && (
              <>Connect wallet to receive invitation link.</>
            )}
            {user.wallet.connected && !invitationCode && (
              <>Purchase ROOSBOX to get invitation link.</>
            )} */}
              </span>
              <button
                onClick={() => {
                  if (user.wallet.connected && invitationCode) {
                    clipboard.writeText(
                      `${import.meta.env.VITE_BASE_URL}/#/participate?${
                        UrlQueryParamsKey.INVITE_CODE
                      }=${invitationCode}`
                    );
                    CustomToast("Copy Success");
                  }
                }}
              >
                {" "}
                <img src={copy} alt="" />
              </button>
            </div>
            <div className="flex items-center">
              <span className="font-[Raleway-Medium] text-[#EAEAEA]">
                code：
              </span>
              <span className="font-[Raleway-Medium]  text-[#F58C00] underline">
                {user.wallet.connected && invitationCode && (
                  <>{invitationCode}</>
                )}
              </span>
              <button
                onClick={() => {
                  if (
                    user.wallet.connected &&
                    invitationCode &&
                    user.wallet.address
                  ) {
                    // navigator.clipboard.writeText(invitationCode);
                    clipboard.writeText(user.wallet.address);
                    CustomToast("Copy Success");
                  }
                }}
              >
                <img src={copy} alt="" />
              </button>
            </div>
          </div>
        )}

        <img className="logo-big absolute z-[1]" src={roos_logo_big} alt="" />
      </div>
    </>
  );
}
