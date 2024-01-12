/*
 * @LastEditors: John
 * @Date: 2024-01-12 09:59:21
 * @LastEditTime: 2024-01-12 10:04:26
 * @Author: John
 */
import "./Invite.scss";
import "./Invite-m.scss";
import roos_logo from "@/assets/roos_logo.png";
import copy from "@/assets/copy.png";
import { useAppSelector } from "@/store/hooks";
import roos_logo_big from "@/assets/roos_logo_big.png";

export default function () {
  const invitationCode = useAppSelector(
    (state) => state.user.wallet.invitationCode
  );
  const user = useAppSelector((state) => state.user);

  return (
    <>
      <div className="invite relative bg-[#26021798] box-border border-solid border-[rgb(245, 140, 0)] flex flex-col overflow-hidden">
        <img className="logo" src={roos_logo} alt="" />
        <span className="font-[Raleway-Bold] uppercase tracking-[0em] text-[#F58C00]">
          Invite benefits
        </span>
        <span className="font-[Raleway-Medium] text-[#EAEAEA]">
          {invitationCode && (
            <>
              ·Invite the box to get contribution, J rewards XX, Q rewards XX, K
              rewards XX.
            </>
          )}
          {!user.wallet.connected && (
            <>Connect wallet to receive invitation link.</>
          )}
        </span>
        <span className="font-[Raleway-Medium] text-[#EAEAEA]">
          {invitationCode && (
            <>
              ·Invite the box to get NFT fragments, J reward XX , Q reward XX, K
              reward XX .
            </>
          )}

          {user.wallet.connected && !invitationCode && (
            <>Purchase ROOSBOX to get invitation link.</>
          )}
        </span>
        <div className="invite-bottom flex">
          <div className="flex items-center">
            <span className="font-[Raleway-Medium] text-[#EAEAEA]">Link：</span>
            <span className="font-[Raleway-Medium] text-[#2B4ACB] underline">
              {invitationCode && <>https://xxxx.com.....7V8M9</>}

              {!user.wallet.connected && (
                <>Connect wallet to receive invitation link.</>
              )}
              {user.wallet.connected && !invitationCode && (
                <>Purchase ROOSBOX to get invitation link.</>
              )}
            </span>
            <button>
              {" "}
              <img src={copy} alt="" />
            </button>
          </div>
          <div className="flex items-center">
            <span className="font-[Raleway-Medium] text-[#EAEAEA]">code：</span>
            <span className="font-[Raleway-Medium]  text-[#2B4ACB] underline">
              {invitationCode && <>87V8M97S</>}

              {!user.wallet.connected && (
                <>Connect wallet to receive invitation link.</>
              )}
              {user.wallet.connected && !invitationCode && (
                <>Purchase ROOSBOX to get invitation link.</>
              )}
            </span>
            <button>
              <img src={copy} alt="" />
            </button>
          </div>
        </div>
        <img className="logo-big absolute" src={roos_logo_big} alt="" />
      </div>
    </>
  );
}
