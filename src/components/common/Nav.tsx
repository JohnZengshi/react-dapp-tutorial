/*
 * @LastEditors: John
 * @Date: 2024-01-04 17:11:06
 * @LastEditTime: 2024-02-27 16:22:45
 * @Author: John
 */
import "./Nav.scss";
import "./Nav-m.scss";
import { useNavigate } from "react-router-dom";
import meun from "@/assets/meum.png";
import meum_m from "@/assets/meum-m.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { isMobile } from "@/utils";

import tuite_y from "@/assets/tuite_y.svg";
import CustomToast from "./CustomToast";
import { useAppSelector } from "@/store/hooks";
import IconFont from "@/components/iconfont";

export default function (props: { connectBtn?: any }) {
  const isSmallScreen = useAppSelector((state) => state.sys.isSmallScreen);
  const navigate = useNavigate();
  const [meunOpen, setMeunOpen] = useState(false);
  const [navExploreOpen, setNavExploreOpen] = useState(false);
  const [navCommunityOpen, setNavCommunityOpen] = useState(false);
  return (
    <>
      <div className="nav fixed t-0 z-[10] flex flex-row items-center w-[100vw] justify-between bg-[#000000] ">
        {/* <img
          className="logo"
          src={roosLogo}
          alt=""
          onClick={() => {
            navigate("/");
          }}
        /> */}
        <IconFont
          className="logo"
          name="roos"
          onClick={() => {
            navigate("/");
          }}
        />

        {/* TODO 移动端适配菜单✔*/}
        <div className="nav_list flex items-center justify-between absolute left-1/2 translate-x-[-50%]">
          <div className="nav_btn">
            <button
              onClick={() => {
                navigate("/");
              }}
            >
              <span>HOME</span>
            </button>
          </div>
          <div className="nav_btn">
            <button
              onClick={() => {
                // return CustomToast("coming soon");
                navigate("/participate");
              }}
            >
              <span>KEYBOX</span>
            </button>
          </div>

          <div className="nav_btn">
            <button>
              <span>EXPLORE</span>
              <IconFont
                name="arrow-down"
                color="#f58c00"
                className="arrowDown active"
              />
              <IconFont
                name="arrow-down"
                color="#FFFFFF"
                className="arrowDown"
              />
            </button>
            <div className="dropDownMeun">
              <div className="dropDownMeunContent">
                <ul>
                  <li onClick={() => CustomToast("coming soon")}>
                    ROOS Explorer（testnet）
                  </li>
                  <li onClick={() => CustomToast("coming soon")}>bridge</li>
                  <li onClick={() => CustomToast("coming soon")}>run node</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="nav_btn">
            <button onClick={() => CustomToast("coming soon")}>
              <span>Ecosystems</span>
            </button>
          </div>

          <div className="nav_btn">
            <button onClick={() => CustomToast("coming soon")}>
              <span>COMMUNITY </span>
              <IconFont
                name="arrow-down"
                color="#f58c00"
                className="arrowDown active"
              />
              <IconFont
                name="arrow-down"
                color="#FFFFFF"
                className="arrowDown"
              />
            </button>

            <div className="dropDownMeun">
              <div className="dropDownMeunContent">
                <ul>
                  <li onClick={() => CustomToast("coming soon")}>
                    <IconFont name="discord" className="icon" color="#EAEAEA" />
                    <IconFont
                      name="discord"
                      className="icon active"
                      color={"#f58c00"}
                    />
                    <span>Discord</span>
                  </li>
                  <li
                    onClick={() =>
                      window.open("https://twitter.com/btcl2_roos", "_blank")
                    }
                  >
                    <IconFont
                      name="a-xinbantuitewuyuanjiao"
                      className="icon"
                      color="#EAEAEA"
                    />
                    <IconFont
                      name="a-xinbantuitewuyuanjiao"
                      className="icon active"
                      color={"#f58c00"}
                    />
                    <span>Twitter</span>
                  </li>
                  <li onClick={() => CustomToast("coming soon")}>
                    <IconFont
                      name="telegram1"
                      className="icon"
                      color="#EAEAEA"
                    />
                    <IconFont
                      name="telegram1"
                      className="icon active"
                      color={"#f58c00"}
                    />
                    <span>Telegram</span>
                  </li>
                  <li onClick={() => CustomToast("coming soon")}>
                    <IconFont
                      name="Youtube-fill"
                      className="icon active"
                      color={"#f58c00"}
                    />
                    <IconFont
                      name="Youtube-fill"
                      className="icon"
                      color="#EAEAEA"
                    />
                    <span>youtube</span>
                  </li>
                  <li
                    onClick={() =>
                      window.open("https://medium.com/@roosnetwork", "_blank")
                    }
                  >
                    <IconFont
                      name="medium"
                      className="icon active"
                      color={"#f58c00"}
                    />
                    <IconFont name="medium" className="icon" color="#EAEAEA" />
                    <span>medium</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="nav_btn">
            <button
              onClick={() =>
                window.open("https://roos.gitbook.io/roos/", "_blank")
              }
            >
              <span>DOCS</span>
            </button>
          </div>

          {/* <div className="nav_btn">
            <button
              onClick={() => {
                window.open("https://info.roospro.com", "_blank");
              }}
            >
              <span>BLOG</span>
            </button>
          </div> */}
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
                // <IconFont name="a-drop-downmenu" className="meun-icon" />
                <img src={meun} className="meun-icon" alt="" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="DropdownMenuContent-meun">
              {/* <img className="logo" src={roosLogo}></img> */}
              <DropdownMenuItem
                onClick={() => {
                  navigate("/");
                }}
              >
                home
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  // return CustomToast("coming soon");
                  navigate("/participate");
                }}
              >
                keybox
              </DropdownMenuItem>
              {/* <DropdownMenuItem onClick={() => CustomToast("coming soon")}>
                explore
              </DropdownMenuItem> */}
              <div
                className={`flex items-center ${
                  navExploreOpen ? "active" : ""
                }`}
                onClick={() => setNavExploreOpen(!navExploreOpen)}
              >
                <span>explore</span>
                <IconFont
                  name="arrow-down"
                  className="icon"
                  color={navExploreOpen ? "#F58C00" : "#EAEAEA"}
                />
              </div>
              {navExploreOpen && (
                <>
                  <div
                    className="sub"
                    onClick={() => CustomToast("coming soon")}
                  >
                    ROOS Explorer（testnet）
                  </div>
                  <div
                    className="sub"
                    onClick={() => CustomToast("coming soon")}
                  >
                    bridge
                  </div>
                  <div
                    className="sub"
                    onClick={() => CustomToast("coming soon")}
                  >
                    run node
                  </div>
                </>
              )}
              <DropdownMenuItem onClick={() => CustomToast("coming soon")}>
                ecosystem
              </DropdownMenuItem>

              <div
                className={`flex items-center ${
                  navCommunityOpen ? "active" : ""
                }`}
                onClick={() => setNavCommunityOpen(!navCommunityOpen)}
              >
                <span>community</span>
                <IconFont
                  name="arrow-down"
                  className="icon"
                  color={navCommunityOpen ? "#F58C00" : "#EAEAEA"}
                />
              </div>
              {navCommunityOpen && (
                <>
                  <div
                    className="sub"
                    onClick={() => CustomToast("coming soon")}
                  >
                    <IconFont name="discord" className="icon" color="#EAEAEA" />
                    <span>Discord</span>
                  </div>
                  <div
                    className="sub"
                    onClick={() =>
                      window.open("https://twitter.com/btcl2_roos", "_blank")
                    }
                  >
                    <IconFont
                      name="a-xinbantuitewuyuanjiao"
                      className="icon"
                      color="#EAEAEA"
                    />
                    <span>Twitter</span>
                  </div>
                  <div
                    className="sub"
                    onClick={() => CustomToast("coming soon")}
                  >
                    <IconFont
                      name="telegram1"
                      className="icon"
                      color="#EAEAEA"
                    />
                    <span>Telegram</span>
                  </div>
                  <div
                    className="sub"
                    onClick={() => CustomToast("coming soon")}
                  >
                    <IconFont
                      name="Youtube-fill"
                      className="icon"
                      color="#EAEAEA"
                    />
                    <span>youtube</span>
                  </div>
                  <div
                    className="sub"
                    onClick={() =>
                      window.open("https://medium.com/@roosnetwork", "_blank")
                    }
                  >
                    <IconFont name="medium" className="icon" color="#EAEAEA" />
                    <span>medium</span>
                  </div>
                </>
              )}

              <DropdownMenuItem
                onClick={() => {
                  window.open("https://roos.gitbook.io/roos/", "_blank");
                }}
              >
                docs
              </DropdownMenuItem>

              <div className="iconList flex items-center">
                {/* <img
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
                /> */}

                <img
                  src={tuite_y}
                  onClick={() => {
                    window.open("https://twitter.com/btcl2_roos", "_blank");
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* <div className="nav_display"></div> */}
    </>
  );
}
