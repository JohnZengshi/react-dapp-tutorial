/*
 * @LastEditors: John
 * @Date: 2024-02-23 18:02:58
 * @LastEditTime: 2024-02-23 19:40:23
 * @Author: John
 */
import "./MiningMachine.scss";
import "./MiningMachine-m.scss";
import ReduceAddInput from "@/components/common/ReduceAddInput";

export const MiningMachine = () => {
  const handleSubmit = () => {};

  return (
    <div className="MiningMachineBox">
      <p className="title">Assemble a mining machine</p>
      <ReduceAddInput />
      <div className="footer">
        <div className="costBox">
          <span className="sub">Cost</span>
          <span className="sup">20</span>
          <span className="sub">Accessories</span>
        </div>
        <div className="submitBtn" onClick={handleSubmit}>
          Assembling mining machine
        </div>
      </div>
    </div>
  );
};

export default MiningMachine;
