/*
 * @LastEditors: John
 * @Date: 2024-01-10 22:19:25
 * @LastEditTime: 2024-01-15 10:12:33
 * @Author: John
 */
import { toast } from "@/components/ui/use-toast";
import toast_info from "@/assets/toast_info.png";
import "./CustomToast-m.scss";
import "./CustomToast.scss";

export default function CustomToast(message: string, time?: number) {
  toast({
    className: `custom-toast`,
    duration: time || 1000,
    action: (
      <>
        <img src={toast_info} className="toast-info-icon" alt="" />
        <span>{message}</span>
      </>
    ),
  });
}
