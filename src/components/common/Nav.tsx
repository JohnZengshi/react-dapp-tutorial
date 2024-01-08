/*
 * @LastEditors: John
 * @Date: 2024-01-04 17:11:06
 * @LastEditTime: 2024-01-08 23:34:31
 * @Author: John
 */
import { Button } from "../ui/button";
import "./Nav.scss";
import "./Nav-m.scss";
import roosLogo from "@/assets/roos_logo.png";
export default function (props: { connectBtn?: any }) {
  return (
    <>
      <div className="nav">
        <img className="logo" src={roosLogo} alt="" />
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
        <div className="nav_meun"></div>
      </div>
    </>
  );
}
