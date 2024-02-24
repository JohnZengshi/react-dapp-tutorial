/*
 * @LastEditors: John
 * @Date: 2024-02-23 18:02:58
 * @LastEditTime: 2024-02-23 19:40:23
 * @Author: John
 */
import "./MiningMachine.scss";
import "./MiningMachine-m.scss";
import ReduceAddInput from "@/components/common/ReduceAddInput";
import { useEffect, useState } from "react";
import { API_GET_ACCESSORIES_NUM } from "@/utils/api";

export const MiningMachine = () => {

  const [asseccNum, setAsseccNum] = useState<number | '-'>('-')
  const [machineNum, setMachineNum] = useState<number>(1)
  const handleSubmit = () => { };

  const initData = async () => {
    const result = await API_GET_ACCESSORIES_NUM()
    setAsseccNum(result?.result || '-')
  }

  useEffect(() => {
    initData()
  }, [])

  return (
    <div className="MiningMachineBox">
      <p className="title">Assemble a mining machine</p>
      <ReduceAddInput onChange={val => setMachineNum(val || 1)} />
      <div className="footer">
        <div className="costBox">
          <span className="sub">Cost</span>
          <span className="sup">{asseccNum ? (Number(asseccNum) * machineNum) : '-'}</span>
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
