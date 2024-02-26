/*
 * @LastEditors: John
 * @Date: 2024-02-23 19:34:01
 * @LastEditTime: 2024-02-26 14:55:28
 * @Author: John
 */
import "./ReduceAddInput.scss";
import "./ReduceAddInput-m.scss";
import { Input, InputProps } from "@/components/ui/input";
import { PropsWithChildren, useState } from "react";

export default function (
  props: PropsWithChildren<{
    onChange?: (value: number) => void;
    disable?: boolean;
  }>
) {
  const [num, setNum] = useState<number>(1);

  return (
    <div className="ReduceAddInput">
      <div
        className={`reduce cursor-pointer ${
          props.disable ? "cursor-not-allowed" : ""
        }`}
        onClick={() => {
          if (props.disable) return;
          if (num == 1) return;
          if (num) {
            setNum(num - 1);
            props.onChange?.(num - 1);
          }
        }}
      >
        -
      </div>
      <div className="input-Content flex-auto">
        <Input
          disabled={props.disable}
          type="text"
          value={num || ""}
          onChange={(e) => {
            let val = parseInt(e.target.value);
            setNum(val);
            if (val <= 0 || Number.isNaN(val)) return;
            console.log("val", val);
            props.onChange?.(val);
            // setNum(1);
          }}
        />
      </div>
      <div
        className={`add cursor-pointer ${
          props.disable ? "cursor-not-allowed" : ""
        }`}
        onClick={() => {
          if (props.disable) return;
          if (num) {
            setNum(num + 1);
            props.onChange?.(num + 1);
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
