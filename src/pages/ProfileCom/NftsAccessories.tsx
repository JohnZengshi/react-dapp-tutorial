/*
 * @LastEditors: John
 * @Date: 2024-02-23 18:02:58
 * @LastEditTime: 2024-02-25 17:28:35
 * @Author: John
 */
import "./NftsAccessories.scss";
import "./NftsAccessories-m.scss";
import key_bg from "@/assets/key_bg.png";
import key_front from "@/assets/key_front.png";
import key from "@/assets/key.png";

export const NftsAccessories = () => {
  return (
    <div className="NftsAccessoriesBox">
      <div className="content">
        <img className="keyBg" src={key_bg} alt="" />
        <img className="keyFront" src={key_front} alt="" />
        <img className="key" src={key} alt="" />
      </div>
      <div className="footer">
        <span className="title">NFTs Accessories</span>
        <span className="mag">x20</span>
      </div>
    </div>
  );
};

export default NftsAccessories;
