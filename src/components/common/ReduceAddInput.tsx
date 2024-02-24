/*
 * @LastEditors: John
 * @Date: 2024-02-23 19:34:01
 * @LastEditTime: 2024-02-23 20:33:24
 * @Author: John
 */
import "./ReduceAddInput.scss";
import "./ReduceAddInput-m.scss";
import { Input, InputProps } from "@/components/ui/input";
import { PropsWithChildren, useState } from "react";

export default function (
  props: PropsWithChildren<{ onChange?: (value: number) => void }>
) {

  const [num, setNum] = useState<number>(1);

  return (
    <div className="ReduceAddInput">
      <div
        className="reduce cursor-pointer"
        onClick={() => {
          if (num == 1) return;
          if (num) {
            setNum(num - 1)
            props.onChange?.(num - 1)
          };
        }}
      >
        -
      </div>
      <div className="input-Content flex-auto">
        <Input
          type="text"
          value={num || ""}
          onChange={(e) => {
            let val = parseInt(e.target.value);
            if (val <= 0) val = 1;
            setNum(val);
            props.onChange?.(val);
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
            props.onChange?.(num + 1)
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
