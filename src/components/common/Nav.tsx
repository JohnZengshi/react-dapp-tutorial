/*
 * @LastEditors: John
 * @Date: 2024-01-04 17:11:06
 * @LastEditTime: 2024-01-09 10:55:48
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
        <div className="nav_list">
          <div className="nav_btn">
            <Button>
              <span>Roosbox</span>
            </Button>
          </div>

          <div className="nav_btn">
            <Button>
              <span>Ecosystems</span>
            </Button>
          </div>

          <div className="nav_btn">
            <Button>
              <span>Bridge</span>
            </Button>
          </div>

          <div className="nav_btn">
            <Button>
              <span>Airdrop</span>
            </Button>
          </div>

          <div className="nav_btn">
            <Button>
              <span>Journey</span>
            </Button>
          </div>

          <div className="nav_btn">
            <Button>
              <span>BLOG</span>
            </Button>
          </div>
        </div>

        <div className="nav_meun">{props.connectBtn}</div>
      </div>
    </>
  );
}
