import { toast } from "@/components/ui/use-toast";
import toast_info from "@/assets/toast_info.png";

export default function CustomToast(message: string) {
  toast({
    className: `
    px-[17px]
    py-[9px] 
    w-[580px] 
    h-[40px]
    rounded-[2px]
    opacity-100
    bg-[#550935]
    box-border
    border-[1px]
    border-solid
    border-[#15395B]
    text-[14px]
    font-normal
    leading-[22px]
    text-[#fff]/[.65]`,
    duration: 800,
    action: (
      <>
        <img src={toast_info} className="w-[16px] h-[16px] mr-[7px]" alt="" />
        <span>{message}</span>
      </>
    ),
  });
}
