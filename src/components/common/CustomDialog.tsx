/*
 * @LastEditors: John
 * @Date: 2024-01-14 17:41:17
 * @LastEditTime: 2024-01-15 16:56:22
 * @Author: John
 */
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { CUSTOM_DIALOG, SET_CUSTOM_DIALOG_OPEN } from "@/store/customCom";
import "./CustomDialog-m.scss";
import "./CustomDialog.scss";
import clickIcon from "@/assets/dialog-left-top-click-icon.png";
import roosLogo from "@/assets/roos_logo.png";

export default function () {
  const customCom = useAppSelector((state) => state.customCom);
  const dispatch = useAppDispatch();

  return (
    <>
      <Dialog
        open={customCom.dialog.open}
        onOpenChange={(v) => {
          dispatch(SET_CUSTOM_DIALOG_OPEN(v));
        }}
      >
        <DialogContent className="dialog-content">
          <div className="custom-dialog w-full h-full">
            <div className="warpper_box w-full h-full border-solid border-[#F58C00] blur-[10px] absolute"></div>
            <div className="content_box flex flex-col items-center absolute w-full h-full  border-solid border-[#F58C00] bg-[#550935] opacity-80 ">
              <img className="click_icon " src={clickIcon} alt="" />
              <img className="roos_logo" src={roosLogo} alt="" />
              <span className="content_text">{customCom.dialog.content}</span>
              <button
                className="ok_btn"
                onClick={() => {
                  dispatch(SET_CUSTOM_DIALOG_OPEN(false));
                }}
              >
                OK
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
