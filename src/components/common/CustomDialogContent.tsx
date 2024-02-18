/*
 * @LastEditors: John
 * @Date: 2024-02-18 16:55:25
 * @LastEditTime: 2024-02-18 17:42:27
 * @Author: John
 */
import { PropsWithChildren } from "react";
import { DialogContent } from "../ui/dialog";
import "./CustomDialogContent-m.scss";
import "./CustomDialogContent.scss";
import { DialogContentProps } from "@radix-ui/react-alert-dialog";

export default function (props: PropsWithChildren<DialogContentProps>) {
  return (
    <DialogContent className="dialog-content">
      <div className="custom-dialog">
        <div className="warpper_box border-solid border-[#F58C00] blur-[10px] absolute"></div>
        <div className="content_box flex flex-col items-center absolute border-solid border-[#F58C00] bg-[#550935] opacity-80 ">
          {props.children}
        </div>
      </div>
    </DialogContent>
  );
}
