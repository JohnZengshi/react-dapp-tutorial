/*
 * @LastEditors: John
 * @Date: 2024-01-04 17:11:06
 * @LastEditTime: 2024-01-11 00:00:13
 * @Author: John
 */
import { Button } from "../ui/button";
import "./Nav.scss";
import "./Nav-m.scss";
import roosLogo from "@/assets/roos_logo.png";
import { useNavigate } from "react-router-dom";
export default function (props: { connectBtn?: any }) {
  const navigate = useNavigate();
  return (
    <>
      <div className="nav">
        <img
          className="logo"
          src={roosLogo}
          alt=""
          onClick={() => {
            navigate("/");
          }}
        />
        {/* TODO 移动端适配菜单*/}
        <div className="nav_list">
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
            <button>
              <span>BLOG</span>
            </button>
          </div>
        </div>

        <div className="nav_meun">{props.connectBtn}</div>
      </div>
    </>
  );
}
