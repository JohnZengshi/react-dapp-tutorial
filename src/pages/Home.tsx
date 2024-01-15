/*
 * @LastEditors: John
 * @Date: 2024-01-03 10:05:18
 * @LastEditTime: 2024-01-15 13:07:15
 * @Author: John
 */
import roosHomeBg from "@/assets/roos-home.mp4";
import { useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "@/components/common/Nav";
import "./Home.scss";
import "./Home-m.scss";
import { ScrollArea } from "@/components/ui/scroll-area";

import ConnectWallet, {
  ConnectWallet_handleType,
} from "@/components/common/ConnectWallet";
import ConnectUs from "@/components/common/ConnectUs";
import { isMobile, isOKApp } from "@/utils";
import videoBg from "@/assets/videoBg.png";
import yellowbar from "@/assets/bar.png";
import roos_logo_medium from "@/assets/roos_logo_medium.png";
import Bitmap from "@/assets/Bitmap.png";
import StarkWare from "@/assets/StarkWare.png";
import tuite_y from "@/assets/tuite_y.png";
import telegram_y from "@/assets/telegram_y.png";
import github_y from "@/assets/github_y.png";
import gitbook_y from "@/assets/gitbook_y.png";
import { useAppSelector } from "@/store/hooks";
export default function () {
  const isSmallScreen = useAppSelector((state) => state.sys.isSmallScreen);
  const navigate = useNavigate();
  const [installed, setInstalled] = useState(false);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string>();
  const connectWalletRef = useRef<ConnectWallet_handleType>(null);

  return (
    <div className="Home">
      {/* <Nav
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
      /> */}
      {
        <div className="videoBg">
          {!isMobile && !isSmallScreen && (
            <video muted loop autoPlay width="100%" height="100%">
              <source src={roosHomeBg} type="video/mp4" />
            </video>
          )}
          {/* {(isMobile || isSmallScreen) && (
            <img className="videoBg_img" src={videoBg} />
          )} */}
        </div>
      }
      {/* <video className="w-full h-full" /> */}
      {/* <Nav /> */}
      <ScrollArea className="content">
        {!isMobile && !isSmallScreen && (
          <>
            <div className="content_1">
              <span>The First Bitcoin Layer2</span>
              <span>For The Bitcoiners.</span>
              <span>By The Bitcoiners.</span>
              <span>Permissionless. Frictionless. Boundless.</span>
              <span>
                ROOS is a trustless Bitcoin Layer2 Scaling Solution based on ZK
                Rollups,which bolsters transaction speed and broadens
                application diversity without sacrificing security.We aim to
                create a Bitcoin rollup ecosystem to power innovation and
                experimentation without relying on Bitcoin forks.
              </span>
              <button
                onClick={() => {
                  navigate("/participate");
                }}
              >
                Get ROOSBOX Now
              </button>
            </div>
            <ConnectUs />
          </>
        )}
        {(isMobile || isSmallScreen) && (
          <div className="flex flex-col items-center">
            <span>The First Bitcoin Layer2</span>
            <span>for The bitcoiners.</span>
            <span>by the bitcoiners.</span>
            <p>ROOS is a trustless Bitcoin Layer2 Scaling Solution based on</p>
            <p>ZK Rollups,which bolsters transaction speed and broadens</p>
            <p>application diversity without sacrificing security</p>
            <p>We aim to create bitcoin rollup ecosystem to</p>
            <p>power innovation without relying on Bitcoin forks.</p>
            <span>ROOS Journey MAP1</span>
            <img className="bar" src={yellowbar} alt="" />
            <span>Treasure Your Roosbox</span>
            <button
              onClick={() => {
                navigate("/participate");
              }}
              className="btn"
            >
              Get RoosBOX Now
            </button>
            <div className="relative">
              {/* <div className="logo_blur"></div> */}
              <img className="logo_big" src={roos_logo_medium} alt="" />
            </div>
            <span>Partners</span>
            <div className="bannerList flex items-center w-full justify-between">
              <img src={Bitmap} alt="" />
              <img src={StarkWare} alt="" />
            </div>
            <span>Permissionless. Frictionless. Boundless.</span>
            <div className="iconList flex items-center w-full justify-between">
              <img src={tuite_y} alt="" />
              <img src={telegram_y} alt="" />
              <img src={github_y} alt="" />
              <img
                src={gitbook_y}
                alt=""
                onClick={() => {
                  window.open(
                    "https://roos.gitbook.io/roos-ntework/",
                    "_blank"
                  );
                }}
              />
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
