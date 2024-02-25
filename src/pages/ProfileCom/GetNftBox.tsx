/*
 * @LastEditors: John
 * @Date: 2024-02-23 18:02:58
 * @LastEditTime: 2024-02-25 17:02:03
 * @Author: John
 */
import "./GetNftBox.scss";
import "./GetNftBox-m.scss";
import { useNavigate } from "react-router-dom";
import IconFont from "@/components/iconfont";

export const GetNftBox = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/participate");
  };

  return (
    <div className="GetNftBox">
      {/* <div className="content"></div> */}
      <IconFont name="wushuju1" className="emtiyDataIcon" color={"#F58C00"} />
      <div className="btn" onClick={handleSubmit}>
        Get Nfts
      </div>
    </div>
  );
};

export default GetNftBox;
