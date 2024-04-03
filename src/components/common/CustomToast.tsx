/*
 * @LastEditors: John
 * @Date: 2024-01-10 22:19:25
 * @LastEditTime: 2024-04-03 16:55:15
 * @Author: John
 */
import { toast } from "@/components/ui/use-toast";
import "./CustomToast-m.scss";
import "./CustomToast.scss";
import Iconfont from "../iconfont";

export default function CustomToast(message: string, time?: number) {
  toast({
    className: `custom-toast bg-[#FFC100]/50 border-[#FFC100] border-solid backdrop-blur-[5px]`,
    duration: time || 1000,
    action: (
      <>
        <Iconfont
          name="gantanhao-yuankuang"
          className="toast-info-icon"
          color="#FFC100"
        ></Iconfont>
        <span className="text-[#fff]/80">{message}</span>
      </>
    ),
  });
}
