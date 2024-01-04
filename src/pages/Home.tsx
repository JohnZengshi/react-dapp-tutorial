/*
 * @LastEditors: John
 * @Date: 2024-01-03 10:05:18
 * @LastEditTime: 2024-01-04 16:07:29
 * @Author: John
 */
import bg from "@/assets/herobg.mp4";
import { useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "@/components/common/Nav";
import "./Home.scss";
export default function () {
  const navigate = useNavigate();
  return (
    <div className="Home w-full h-full">
      <Nav />
      <video muted loop autoPlay className="w-full h-full">
        <source src={bg} type="video/mp4" />
      </video>
      <video className="w-full h-full" />
      {/* <Nav /> */}

      <div className="content_1">
        <div className="content_1_1">
          <span>
            The First Bitcoin Layer2 ,Build For Bitcoiners,Led By The
            Community,100 Fair Launch.
          </span>
          <span>
            ROOS is the first fully decentralized EVM-compatible Bitcoin L2 that
            uses BTC as Gas. It allows all DApps which can run in the Ethereum
            ecosystem to operate on Bitcoin L2.
          </span>
          <span>Claim Your ROS</span>
          <span>100% ROS tokens will be Airdropped to Community.</span>
          <span>Becoming a Citizen of ROOS and Claim your ROS!</span>

          <button
            onClick={() => {
              navigate("/participate");
            }}
          >
            Get RoosNode Now
          </button>
        </div>
      </div>
    </div>
  );
}
