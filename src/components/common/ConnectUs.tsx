/*
 * @LastEditors: John
 * @Date: 2024-01-09 14:57:52
 * @LastEditTime: 2024-01-09 18:27:54
 * @Author: John
 */

import "./ConnectUs.scss";
import "./ConnectUs-m.scss";
import tuite from "@/assets/tuite.png";
import telegram from "@/assets/telegram.png";
import github from "@/assets/github.png";
import gitbook from "@/assets/gitbook.png";
import roosLogo from "@/assets/roos_logo.png";

import Bitcoin from "@/assets/Bitcoin.png";
import Bitmap from "@/assets/Bitmap.png";
import StarkWare from "@/assets/StarkWare.png";
import { useNavigate } from "react-router-dom";
export default function () {
  const navigate = useNavigate();
  return (
    <>
      <div className="connect_btn">
        <div className="Partners">
          <span>Partners:</span>
          <img src={Bitcoin} alt="" />
          <img src={Bitmap} alt="" />
          <img src={StarkWare} alt="" />
        </div>
        <div className="ContactUs">
          <span>Contact Us:</span>
          <img src={tuite} alt="" />
          <img src={telegram} alt="" />
          <img src={github} alt="" />
          <img src={gitbook} alt="" />
        </div>
      </div>

      <div className="connect_btn-m">
        <img
          className="logo"
          src={roosLogo}
          alt=""
          onClick={() => {
            navigate("/");
          }}
        />
        <img src={tuite} alt="" />
        <img src={telegram} alt="" />
        <img src={github} alt="" />
        <img src={gitbook} alt="" />
      </div>
    </>
  );
}
