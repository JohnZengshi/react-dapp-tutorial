/*
 * @LastEditors: John
 * @Date: 2024-01-04 17:11:06
 * @LastEditTime: 2024-01-15 13:08:22
 * @Author: John
 */
import { Button } from "../ui/button";
import "./Nav.scss";
import "./Nav-m.scss";
import roosLogo from "@/assets/roos_logo.png";
import { useNavigate } from "react-router-dom";
import meun from "@/assets/meum.png";
import meum_m from "@/assets/meum-m.png";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { isMobile } from "@/utils";
import tuite from "@/assets/tuite.png";
import telegram from "@/assets/telegram.png";
import github from "@/assets/github.png";
import gitbook from "@/assets/gitbook.png";

import tuite_y from "@/assets/tuite_y.png";
import telegram_y from "@/assets/telegram_y.png";
import github_y from "@/assets/github_y.png";
import gitbook_y from "@/assets/gitbook_y.png";
import CustomToast from "./CustomToast";
import { useAppSelector } from "@/store/hooks";

export default function (props: { connectBtn?: any }) {
  const isSmallScreen = useAppSelector((state) => state.sys.isSmallScreen);
  const navigate = useNavigate();
  const [meunOpen, setMeunOpen] = useState(false);
  return (
    <>
      <div className="nav fixed t-0 z-[10] flex flex-row items-center w-[100vw] justify-between bg-[#000000] ">
        <img
          className="logo"
          src={roosLogo}
          alt=""
          onClick={() => {
            navigate("/");
          }}
        />
        {/* TODO 移动端适配菜单✔*/}
        <div className="nav_list flex items-center absolute left-1/2 translate-x-[-50%]">
          <div className="nav_btn">
            <button
              onClick={() => {
                navigate("/participate");
              }}
            >
              <span>Roosbox</span>
            </button>
          </div>

          <div className="nav_btn">
            <button onClick={() => CustomToast("coming soon")}>
              <span>Ecosystems</span>
            </button>
          </div>

          <div className="nav_btn">
            <button onClick={() => CustomToast("coming soon")}>
              <span>Bridge</span>
            </button>
          </div>

          <div className="nav_btn">
            <button onClick={() => CustomToast("coming soon")}>
              <span>Airdrop</span>
            </button>
          </div>

          <div className="nav_btn">
            <button onClick={() => CustomToast("coming soon")}>
              <span>Journey</span>
            </button>
          </div>

          <div className="nav_btn">
            <button
              onClick={() => {
                window.open("https://info.rootsat.co", "_blank");
              }}
            >
              <span>BLOG</span>
            </button>
          </div>
        </div>

        <div
          className="nav_meun flex items-center"
          // onClick={() => {
          //   setMeunOpen(!open);
          // }}
        >
          {props.connectBtn}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {isMobile || isSmallScreen ? (
                <img src={meum_m} className="meun-icon"></img>
              ) : (
                <img src={meun} className="meun-icon" alt="" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="DropdownMenuContent-meun">
              {/* <img className="logo" src={roosLogo}></img> */}
              <DropdownMenuItem
                onClick={() => {
                  navigate("/participate");
                }}
              >
                Roosbox
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => CustomToast("coming soon")}>
                Ecosystems
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => CustomToast("coming soon")}>
                Bridge
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => CustomToast("coming soon")}>
                Airdrop
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => CustomToast("coming soon")}>
                Journey
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  window.open("https://info.rootsat.co", "_blank");
                }}
              >
                BLOG
              </DropdownMenuItem>

              <div className="iconList flex items-center">
                <img
                  src={tuite_y}
                  onClick={() => {
                    window.open("https://twitter.com/btcl2_roos", "_blank");
                  }}
                  alt=""
                />
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* <div className="nav_display"></div> */}
    </>
  );
}
