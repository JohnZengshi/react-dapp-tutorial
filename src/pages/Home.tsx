/*
 * @LastEditors: John
 * @Date: 2024-01-03 10:05:18
 * @LastEditTime: 2024-01-10 18:32:46
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
export default function () {
  const navigate = useNavigate();
  const [installed, setInstalled] = useState(false);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string>();
  const connectWalletRef = useRef<ConnectWallet_handleType>(null);

  return (
    <div className="Home">
      <Nav
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
      />
      <div className="videoBg">
        <video muted loop autoPlay={!isMobile} width="100%" height="100%">
          <source src={roosHomeBg} type="video/mp4" />
        </video>
      </div>
      {/* <video className="w-full h-full" /> */}
      {/* <Nav /> */}
      <ScrollArea className="content">
        {/* <div className="content_1"> */}
        <div className="nav_box"></div>
        <div className="content_1">
          <span>The First Bitcoin Layer2</span>
          <span>For The Bitcoiners.</span>
          <span>By The Bitcoiners.</span>
          <span>Permissionless. Frictionless. Boundless.</span>
          <span>
            ROOS is a trustless Bitcoin Layer2 Scaling Solution based on ZK
            Rollups,which bolsters transaction speed and broadens application
            diversity without sacrificing security.We aim to create a Bitcoin
            rollup ecosystem to power innovation and experimentation without
            relying on Bitcoin forks.
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
        {/* </div> */}
      </ScrollArea>
    </div>
  );
}
