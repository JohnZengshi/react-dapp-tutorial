/*
 * @LastEditors: John
 * @Date: 2024-01-10 22:19:25
 * @LastEditTime: 2024-01-16 11:23:45
 * @Author: John
 */
import { toast } from "@/components/ui/use-toast";
import "./CustomToast-m.scss";
import "./CustomToast.scss";
import Iconfont from "../iconfont";

export default function CustomToast(message: string, time?: number) {
  toast({
    className: `custom-toast bg-[#f58c00]/50 border-[#f58c00] border-solid backdrop-blur-[5px]`,
    duration: time || 1000,
    action: (
      <>
        <Iconfont
          name="gantanhao-yuankuang"
          className="toast-info-icon"
          color="#F58C00"
        ></Iconfont>
        <span className="text-[#fff]/80">{message}</span>
      </>
    ),
  });
}
