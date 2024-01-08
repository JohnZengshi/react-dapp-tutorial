/*
 * @LastEditors: John
 * @Date: 2024-01-04 17:11:06
 * @LastEditTime: 2024-01-08 17:23:10
 * @Author: John
 */
import { Button } from "../ui/button";
import "./Nav.scss";
import roosLogo from "@/assets/roos_logo.png";
export default function (props: { connectBtn?: any }) {
  return (
    <>
      <div className="nav">
        <img className="logo" src={roosLogo} alt="" />
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
        {/* <div className="nav_meun">
          <div className="nav_3_1">
            {props.connectBtn ? (
              props.connectBtn
            ) : (
              <Button>
                EN
                <span></span>
              </Button>
            )}
          </div>
        </div> */}
      </div>
    </>
  );
}
