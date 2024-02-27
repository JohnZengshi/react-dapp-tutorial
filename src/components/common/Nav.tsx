/*
 * @LastEditors: John
 * @Date: 2024-01-04 17:11:06
 * @LastEditTime: 2024-02-27 17:21:28
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
import { THIRD_URL } from "@/constant/thirdUrl";
import CustomNavigationMenu from "./CustomNavigationMenu";

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
          <CustomNavigationMenu
            title="HOME"
            titleCallBack={() => {
              navigate("/");
            }}
          />
          <CustomNavigationMenu
            title="KEYBOX"
            titleCallBack={() => {
              navigate("/participate");
            }}
          />
          <CustomNavigationMenu
            title="EXPLORE"
            itemList={[
              {
                title: "ROOS Explorer（testnet）",
                callBack() {
                  CustomToast("coming soon");
                },
              },
              {
                title: "bridge",
                callBack() {
                  CustomToast("coming soon");
                },
              },
              {
                title: "run node",
                callBack() {
                  CustomToast("coming soon");
                },
              },
            ]}
          />
          <CustomNavigationMenu
            title="Ecosystems"
            titleCallBack={() => CustomToast("coming soon")}
          />
          <CustomNavigationMenu
            title="COMMUNITY"
            itemList={[
              {
                title: "Discord",
                icon: "discord",
                callBack() {
                  CustomToast("coming soon");
                },
              },
              {
                title: "Twitter",
                icon: "a-xinbantuitewuyuanjiao",
                callBack() {
                  window.open(THIRD_URL.TWITTER, "_blank");
                },
              },
              {
                title: "Telegram",
                icon: "telegram1",
                callBack() {
                  CustomToast("coming soon");
                },
              },
              {
                title: "youtube",
                icon: "Youtube-fill",
                callBack() {
                  CustomToast("coming soon");
                },
              },
              {
                title: "medium",
                icon: "medium",
                callBack() {
                  window.open(THIRD_URL.MEDIUM, "_blank");
                },
              },
            ]}
          />
          <CustomNavigationMenu
            title="DOCS"
            titleCallBack={() => window.open(THIRD_URL.GITBOOK, "_blank")}
          />
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
                    onClick={() => window.open(THIRD_URL.TWITTER, "_blank")}
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
                    onClick={() => window.open(THIRD_URL.MEDIUM, "_blank")}
                  >
                    <IconFont name="medium" className="icon" color="#EAEAEA" />
                    <span>medium</span>
                  </div>
                </>
              )}

              <DropdownMenuItem
                onClick={() => {
                  window.open(THIRD_URL.GITBOOK, "_blank");
                }}
              >
                docs
              </DropdownMenuItem>

              <div className="iconList flex items-center">
                {/* <img
                  src={tuite_y}
                  onClick={() => {
                    window.open(THIRD_URL.TWITTER, "_blank");
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* <div className="nav_display"></div> */}
    </>
  );
}
