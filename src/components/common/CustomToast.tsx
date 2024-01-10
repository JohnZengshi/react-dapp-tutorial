import { toast } from "@/components/ui/use-toast";
import toast_info from "@/assets/toast_info.png";
import "./CustomToast-m.scss";

export default function CustomToast(message: string) {
  toast({
    className: `
    min-[768px]:px-[17px]
    min-[768px]:py-[9px] 
    min-[768px]:w-[580px] 
    min-[768px]:h-[40px]
    min-[768px]:rounded-[2px]
    min-[768px]:border-[1px]
    min-[768px]:text-[14px]
    min-[768px]leading-[22px]

    opacity-100
    bg-[#550935]
    box-border
    border-solid
    border-[#15395B]
    font-normal
    text-[#fff]/[.65]
    custom-toast-m
    `,
    duration: 1000,
    action: (
      <>
        <img src={toast_info} className="w-[16px] h-[16px] mr-[7px]" alt="" />
        <span>{message}</span>
      </>
    ),
  });
}
