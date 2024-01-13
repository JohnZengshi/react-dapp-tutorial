/*
 * @LastEditors: John
 * @Date: 2024-01-12 09:59:21
 * @LastEditTime: 2024-01-13 19:42:58
 * @Author: John
 */
import "./Invite.scss";
import "./Invite-m.scss";
import roos_logo from "@/assets/roos_logo.png";
import copy from "@/assets/copy.png";
import { useAppSelector } from "@/store/hooks";
import roos_logo_big from "@/assets/roos_logo_big.png";
import { Fragment, useEffect, useState } from "react";
import { API_GET_NODE_LIST, NodeInfo } from "@/utils/api";
import { UrlQueryParamsKey, shortenString } from "@/utils";
import CustomToast from "./CustomToast";

export default function () {
  const invitationCode = useAppSelector(
    (state) => state.user.wallet.invitationCode
  );
  const user = useAppSelector((state) => state.user);

  const [nodeList, setNodeList] = useState<NodeInfo[]>([]);

  useEffect(() => {
    (async () => {
      let nodeList = await API_GET_NODE_LIST();
      setNodeList([...nodeList]);
    })();

    return () => {};
  }, []);

  return (
    <>
      <div className="invite relative bg-[#26021798] box-border border-solid border-[rgb(245, 140, 0)] flex flex-col overflow-hidden">
        <img className="logo" src={roos_logo} alt="" />
        <span className="font-[Raleway-Bold] uppercase tracking-[0em] text-[#F58C00]">
          Invite benefits
        </span>
        <span className="font-[Raleway-Medium] text-[#EAEAEA]">
          {user.wallet.connected && invitationCode && (
            <>
              ·Invite the box to get contribution,{" "}
              {nodeList.map((v, i) => {
                return (
                  <Fragment key={i}>
                    {v.nodeName} rewards {v.contribution}{" "}
                    {i === nodeList.length - 1 ? "." : ","}{" "}
                  </Fragment>
                );
              })}
            </>
          )}
          {!user.wallet.connected && (
            <>Connect wallet to receive invitation link.</>
          )}
        </span>
        <span className="font-[Raleway-Medium] text-[#EAEAEA]">
          {user.wallet.connected && invitationCode && (
            <>
              ·Invite the box to get NFT fragments,{" "}
              {nodeList.map((v, i) => {
                return (
                  <Fragment key={i}>
                    {v.nodeName} rewards {v.nftNumber}{" "}
                    {i === nodeList.length - 1 ? "." : ","}{" "}
                  </Fragment>
                );
              })}
            </>
          )}

          {user.wallet.connected && !invitationCode && (
            <>Purchase ROOSBOX to get invitation link.</>
          )}
        </span>
        {user.wallet.connected && invitationCode && (
          <div className="invite-bottom flex">
            <div className="flex items-center">
              <span className="font-[Raleway-Medium] text-[#EAEAEA]">
                Link：
              </span>
              <span className="font-[Raleway-Medium] text-[#F58C00] underline">
                {user.wallet.connected && invitationCode && (
                  // TODO 邀请连接需要动态生成
                  <>
                    {shortenString(
                      `https://roos-test.fcaex.vip/#/participate?${UrlQueryParamsKey.INVITE_CODE}=${invitationCode}`,
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
              <button>
                {" "}
                <img
                  src={copy}
                  alt=""
                  onClick={() => {
                    if (user.wallet.connected && invitationCode) {
                      navigator.clipboard.writeText(
                        `https://roos-test.fcaex.vip/#/participate?${UrlQueryParamsKey.INVITE_CODE}=${invitationCode}`
                      );
                      CustomToast("Copy Success");
                    }
                  }}
                />
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
                {/* TODO 多余逻辑 */}
                {!user.wallet.connected && (
                  <>Connect wallet to receive invitation link.</>
                )}
                {user.wallet.connected && !invitationCode && (
                  <>Purchase ROOSBOX to get invitation link.</>
                )}
              </span>
              <button>
                <img
                  src={copy}
                  alt=""
                  onClick={() => {
                    if (user.wallet.connected && invitationCode) {
                      navigator.clipboard.writeText(invitationCode);
                      CustomToast("Copy Success");
                    }
                  }}
                />
              </button>
            </div>
          </div>
        )}

        <img className="logo-big absolute" src={roos_logo_big} alt="" />
      </div>
    </>
  );
}
