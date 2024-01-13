/*
 * @LastEditors: John
 * @Date: 2024-01-04 17:11:06
 * @LastEditTime: 2024-01-13 18:33:16
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

export default function (props: { connectBtn?: any }) {
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
            <button>
              <span>Roosbox</span>
            </button>
          </div>

          <div className="nav_btn">
            <button>
              <span>Ecosystems</span>
            </button>
          </div>

          <div className="nav_btn">
            <button>
              <span>Bridge</span>
            </button>
          </div>

          <div className="nav_btn">
            <button>
              <span>Airdrop</span>
            </button>
          </div>

          <div className="nav_btn">
            <button>
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
              {isMobile ? (
                <img src={meum_m} className="meun-icon"></img>
              ) : (
                <img src={meun} className="meun-icon" alt="" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="DropdownMenuContent-meun">
              <DropdownMenuItem>Roosbox</DropdownMenuItem>
              <DropdownMenuItem>Ecosystems</DropdownMenuItem>
              <DropdownMenuItem>Bridge</DropdownMenuItem>
              <DropdownMenuItem>Airdrop</DropdownMenuItem>
              <DropdownMenuItem>Journey</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  window.open("https://info.rootsat.co", "_blank");
                }}
              >
                BLOG
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* <div className="nav_display"></div> */}
    </>
  );
}
