/*
 * @LastEditors: John
 * @Date: 2024-01-14 17:41:17
 * @LastEditTime: 2024-03-18 16:05:17
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
import loading from "@/assets/loading.svg";
import IconFont from "../iconfont";

export default function () {
  const customCom = useAppSelector((state) => state.customCom);
  const dispatch = useAppDispatch();

  return (
    <>
      <Dialog
        open={customCom.dialog.open}
        onOpenChange={(v) => {
          if (customCom.dialog.cannotClose) {
            dispatch(SET_CUSTOM_DIALOG_OPEN(true));
            return;
          }
          if (!v) customCom.dialog.onClose?.();
          dispatch(SET_CUSTOM_DIALOG_OPEN(v));
        }}
      >
        <CustomDialogContent hiddenClose={customCom.dialog.cannotClose}>
          <div className="CustomDialog flex flex-col justify-center items-center w-full">
            {/* <img className="click_icon " src={clickIcon} alt="" /> */}
            {/* <img className="roos_logo" src={roosLogo} alt="" /> */}
            <IconFont name="roos" className="roos_logo" />
            {customCom.dialog.loading && (
              <IconFont name="jiazai" className="loading" color={"#ffc100"} />
            )}
            <span className="content_text text-center">
              {customCom.dialog.content}
            </span>
            {customCom.dialog.hash && (
              <span
                className="hash text-ellipsis whitespace-nowrap overflow-hidden block text-center w-full"
                onClick={() => customCom.dialog.clickHashCallBack?.()}
              >
                {customCom.dialog.hash}
              </span>
            )}
            {customCom.dialog.showConfirmBtn && (
              <button
                className="ok_btn"
                onClick={() => {
                  dispatch(SET_CUSTOM_DIALOG_OPEN(false));
                  customCom.dialog.confirmBtnCallBack?.();
                }}
              >
                {customCom.dialog.confirmBtnText || "OK"}
              </button>
            )}
          </div>
        </CustomDialogContent>
      </Dialog>
    </>
  );
}
