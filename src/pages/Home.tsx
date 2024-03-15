/*
 * @LastEditors: John
 * @Date: 2024-01-03 10:05:18
 * @LastEditTime: 2024-03-15 11:11:52
 * @Author: John
 */
import roosHomeBg from "@/assets/roos-home.mp4";
import { useNavigate } from "react-router-dom";
import "./Home.scss";
import "./Home-m.scss";
import { ScrollArea } from "@/components/ui/scroll-area";

import ConnectUs from "@/components/common/ConnectUs";
import { isMobile, isOKApp } from "@/utils";
import yellowbar from "@/assets/scrollBar.png";

import roos_logo_wrap from "@/assets/roos_logo_wrap.png";
import roos_logo_inside from "@/assets/roos_logo_inside.png";
import Bitmap from "@/assets/bitmap.svg";
import tuite_y from "@/assets/tuite_y.svg";
import { useAppSelector } from "@/store/hooks";
import IconFont from "@/components/iconfont";
import CustomToast from "@/components/common/CustomToast";
import { THIRD_URL } from "@/constant/thirdUrl";
export default function () {
  const isSmallScreen = useAppSelector((state) => state.sys.isSmallScreen);
  const navigate = useNavigate();

  return (
    <div className="Home">
      <ScrollArea className="content">
        {!isSmallScreen && (
          <>
            <div className="content_1 flex flex-col box-border flex-auto">
              {
                <div className="videoBg">
                  {(!isSmallScreen || !isMobile) && (
                    <video muted loop autoPlay width="100%" height="100%">
                      <source src={roosHomeBg} type="video/mp4" />
                    </video>
                  )}
                </div>
              }
              <span>The First Bitcoin Layer2</span>
              <span>For The Bitcoiners.</span>
              <span>By The Bitcoiners.</span>
              <span>Permissionless. Frictionless. Boundless.</span>
              <span>
                {/* ROOS is a trustless Bitcoin Layer2 Scaling Solution based on ZK
                Rollups,which bolsters transaction speed and broadens
                application diversity without sacrificing security.We aim to
                create a Bitcoin rollup ecosystem to power innovation and
                experimentation without relying on Bitcoin forks. */}
                ROOS is the first modular layer2 to scale bitcoin’s computing &
                storage based on zk rollup,which bolsters transaction speed and
                broadens application diversity without sacrificing security.We
                aim to create a Bitcoin rollup ecosystem to power innovation and
                experimentation without relying on Bitcoin forks.
              </span>
              <button
                onClick={() => {
                  // return CustomToast("coming soon");
                  navigate("/participate");
                }}
              >
                Get KEYBOX Now
              </button>
            </div>
            {/* <ConnectUs /> */}
          </>
        )}
        {isSmallScreen && (
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
            <span>Treasure Your KeyBOX</span>
            <button
              onClick={() => {
                // return CustomToast("coming soon");
                navigate("/participate");
              }}
              className="btn"
            >
              Get RoosBOX Now
            </button>
            <div className="logo_big relative">
              <img className="wrap" src={roos_logo_wrap} alt="" />
              <img className="inside" src={roos_logo_inside} alt="" />
            </div>
            <div className="line"></div>
            {/* <span>Partners</span>
            <div className="bannerList flex items-center w-full justify-between">
              <img src={Bitmap} alt="" />
              <IconFont className="icon" name="StarkWare"></IconFont>
            </div> */}
            <span>Permissionless. Frictionless. Boundless.</span>
            <div className="iconList flex items-center w-full justify-between">
              <img
                src={tuite_y}
                onClick={() => {
                  window.open(THIRD_URL.TWITTER, "_blank");
                }}
                alt=""
              />
              <IconFont className="icon" name="telegram" color="#F58C00" />
              <IconFont className="icon" name="github" color="#F58C00" />
              <IconFont
                className="icon"
                name="book"
                color="#F58C00"
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
