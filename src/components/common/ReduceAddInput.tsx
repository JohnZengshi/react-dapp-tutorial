/*
 * @LastEditors: John
 * @Date: 2024-02-23 19:34:01
 * @LastEditTime: 2024-02-23 19:37:08
 * @Author: John
 */
import "./ReduceAddInput.scss";
import "./ReduceAddInput-m.scss";
import { Input } from "@/components/ui/input";
import { useState } from "react";
export default function () {
  const [num, setNum] = useState<number>(1);
  return (
    <div className="ReduceAddInput">
      <div
        className="reduce cursor-pointer"
        onClick={() => {
          // if (num == 1) return;
          if (num) setNum(num - 1);
        }}
      >
        -
      </div>
      <div className="input-Content flex-auto">
        <Input
          type="text"
          value={num || ""}
          onChange={(e) => {
            setNum(parseInt(e.target.value));
            // setNum(1);
          }}
        />
      </div>
      <div
        className="add cursor-pointer"
        onClick={() => {
          // if (num == 1) return;
          if (num) {
            setNum(num + 1);
          } else {
            setNum(1);
          }
        }}
      >
        +
      </div>
    </div>
  );
}
