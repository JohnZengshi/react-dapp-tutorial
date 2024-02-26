/*
 * @LastEditors: John
 * @Date: 2024-02-23 18:02:58
 * @LastEditTime: 2024-02-26 16:24:48
 * @Author: John
 */
import "./NftsAccessories.scss";
import "./NftsAccessories-m.scss";
import key_bg from "@/assets/key_bg.png";
import key_front from "@/assets/key_front.png";
import key from "@/assets/key.png";
import { PropsWithChildren, useEffect, useState } from "react";
import { API_GET_ACCESSORIES_NUM } from "@/utils/api";

export const NftsAccessories = () => {
  const [asseccNum, setAsseccNum] = useState<number>();
  const initData = async () => {
    const result = await API_GET_ACCESSORIES_NUM();
    setAsseccNum(result?.result);
  };

  useEffect(() => {
    initData();
  }, []);
  return (
    <div className="NftsAccessoriesBox">
      <div className="content">
        <img className="keyBg" src={key_bg} alt="" />
        <img className="keyFront" src={key_front} alt="" />
        <img className="key" src={key} alt="" />
      </div>
      <div className="footer">
        <span className="title">NFTs Accessories</span>
        <span className="mag">x{asseccNum}</span>
      </div>
    </div>
  );
};

export default NftsAccessories;
