/*
 * @LastEditors: John
 * @Date: 2024-02-18 16:55:25
 * @LastEditTime: 2024-02-24 11:57:40
 * @Author: John
 */
import { PropsWithChildren } from "react";
import { DialogContent } from "../ui/dialog";
import "./CustomDialogContent-m.scss";
import "./CustomDialogContent.scss";
import { DialogContentProps } from "@radix-ui/react-alert-dialog";

export default function (
  props: PropsWithChildren<DialogContentProps & { hiddenClose?: boolean }>
) {
  return (
    <DialogContent {...props} className={`dialog-content ${props.className}`}>
      <div className="custom-dialog">
        <div className="warpper_box border-solid border-[#ffc100] blur-[10px] absolute"></div>
        <div className="content_box flex flex-col items-center absolute border-solid border-[#ffc100] bg-[#550935] opacity-80 ">
          {props.children}
        </div>
      </div>
    </DialogContent>
  );
}
