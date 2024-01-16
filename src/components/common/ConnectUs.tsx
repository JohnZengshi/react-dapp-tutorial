/*
 * @LastEditors: John
 * @Date: 2024-01-09 14:57:52
 * @LastEditTime: 2024-01-16 12:43:50
 * @Author: John
 */

import "./ConnectUs.scss";
import "./ConnectUs-m.scss";
import tuite from "@/assets/tuite.svg";
import Bitmap from "@/assets/bitmap.svg";
import { useNavigate } from "react-router-dom";
import IconFont from "../iconfont";
export default function () {
  const navigate = useNavigate();
  return (
    <>
      <div className="connect_btn">
        <div className="Partners">
          <span>Partners:</span>
          {/* <img className="icon" src={Bitcoin} alt="" /> */}
          <IconFont className="icon" name="Bitcoin" />
          <img className="icon" src={Bitmap} alt="" />
          {/* <img className="icon" src={StarkWare} alt="" /> */}
          <IconFont className="icon" name="StarkWare" />
        </div>
        <div className="ContactUs">
          <span>Contact Us:</span>
          <img
            className="icon cursor-pointer"
            src={tuite}
            onClick={() => {
              window.open("https://twitter.com/btcl2_roos", "_blank");
            }}
            alt=""
          />
          {/* <img src={telegram} alt="" />
          <img src={github} alt="" /> */}
          {/* <img
            src={gitbook}
            alt=""
            onClick={() => {
              window.open("https://roos.gitbook.io/roos-ntework/", "_blank");
            }}
          /> */}
          <IconFont
            className="icon cursor-pointer"
            name="telegram"
            color="#fff"
          />
          <IconFont
            className="icon cursor-pointer"
            name="github"
            color="#fff"
          />
          <IconFont
            className="icon mr-0 cursor-pointer"
            name="book"
            color="#fff"
            onClick={() => {
              window.open("https://roos.gitbook.io/roos-ntework/", "_blank");
            }}
          />
        </div>
      </div>

      <div className="connect_btn-m">
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
        <img
          className="icon"
          src={tuite}
          onClick={() => {
            window.open("https://twitter.com/btcl2_roos", "_blank");
          }}
          alt=""
        />
        {/* <img src={telegram} alt="" />
        <img src={github} alt="" />
        <img
          src={gitbook}
          alt=""
          onClick={() => {
            window.open("https://roos.gitbook.io/roos-ntework/", "_blank");
          }}
        /> */}
        <IconFont className="icon" name="telegram" color="#fff" />
        <IconFont className="icon" name="github" color="#fff" />
        <IconFont
          className="icon mr-0"
          name="book"
          color="#fff"
          onClick={() => {
            window.open("https://roos.gitbook.io/roos-ntework/", "_blank");
          }}
        />
      </div>
    </>
  );
}
