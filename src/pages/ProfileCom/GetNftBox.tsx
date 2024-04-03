/*
 * @LastEditors: John
 * @Date: 2024-02-23 18:02:58
 * @LastEditTime: 2024-02-27 16:22:57
 * @Author: John
 */
import "./GetNftBox.scss";
import "./GetNftBox-m.scss";
import { useNavigate } from "react-router-dom";
import IconFont from "@/components/iconfont";
import CustomToast from "@/components/common/CustomToast";

export const GetNftBox = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    // return CustomToast("coming soon");
    navigate("/participate");
  };

  return (
    <div className="GetNftBox">
      {/* <div className="content"></div> */}
      <IconFont name="wushuju1" className="emtiyDataIcon" color={"#ffc100"} />
      <div className="btn" onClick={handleSubmit}>
        Get KeyBox
      </div>
    </div>
  );
};

export default GetNftBox;
