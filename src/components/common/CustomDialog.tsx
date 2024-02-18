/*
 * @LastEditors: John
 * @Date: 2024-01-14 17:41:17
 * @LastEditTime: 2024-02-18 17:23:31
 * @Author: John
 */
import "./CustomDialog.scss";
import "./CustomDialog-m.scss";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { CUSTOM_DIALOG, SET_CUSTOM_DIALOG_OPEN } from "@/store/customCom";

import clickIcon from "@/assets/dialog-left-top-click-icon.png";
import roosLogo from "@/assets/roos_logo.png";
import CustomDialogContent from "./CustomDialogContent";

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
        <CustomDialogContent>
          <div className="CustomDialog flex flex-col justify-center items-center">
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
        </CustomDialogContent>
      </Dialog>
    </>
  );
}
