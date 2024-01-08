/*
 * @LastEditors: John
 * @Date: 2024-01-03 10:05:18
 * @LastEditTime: 2024-01-08 22:39:53
 * @Author: John
 */
import bg from "@/assets/herobg.mp4";
import { useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "@/components/common/Nav";
import "./Home.scss";
import "./Home-m.scss";
import { ScrollArea } from "@/components/ui/scroll-area";
import tuite from "@/assets/tuite.png";
import telegram from "@/assets/telegram.png";
import github from "@/assets/github.png";
import gitbook from "@/assets/gitbook.png";
export default function () {
  const navigate = useNavigate();
  return (
    <div className="Home">
      <Nav />
      {/* <video muted loop autoPlay className="w-full h-full">
        <source src={bg} type="video/mp4" />
      </video>
      <video className="w-full h-full" /> */}
      {/* <Nav /> */}
      <ScrollArea className="content">
        {/* <div className="content_1"> */}
        <div className="content_1">
          <span>The First Bitcoin Layer2</span>
          <span>For The Bitcoiners.</span>
          <span>By The Bitcoiners.</span>
          <span>Permissionless. Frictionless. Boundless.</span>
          <span>
            ROOS is the first fully decentralized EVM-compatible Bitcoin L2 that
            uses BTC as Gas. It allows all DApps which can run in the Ethereum
            ecosystem to operate on Bitcoin L2.
          </span>
          <button
            onClick={() => {
              navigate("/participate");
            }}
          >
            Get RoosNode Now
          </button>
        </div>

        <div className="connect_btn">
          <div className="Partners">
            <span>Partners:</span>
            <img src={tuite} alt="" />
            <img src={telegram} alt="" />
            <img src={github} alt="" />
            <img src={gitbook} alt="" />
          </div>
          <div className="ContactUs">
            <span>Contact Us:</span>
            <img src={tuite} alt="" />
            <img src={telegram} alt="" />
            <img src={github} alt="" />
            <img src={gitbook} alt="" />
          </div>
        </div>
        {/* </div> */}
      </ScrollArea>
    </div>
  );
}
