/*
 * @LastEditors: John
 * @Date: 2024-03-12 18:18:36
 * @LastEditTime: 2024-03-28 18:10:13
 * @Author: John
 */
import { ScrollArea } from "@/components/ui/scroll-area";
import "./Test.scss";
import "./Test-m.scss";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import lottie1 from "@/assets/lottie/lottie1.json";
export const Test = () => {
  return (
    <ScrollArea className="Test flex items-center justify-center">
      <Player
        autoplay
        loop
        // src="https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json"
        src={lottie1}
      >
        <Controls
          visible={true}
          buttons={["play", "repeat", "frame", "debug"]}
        />
      </Player>
    </ScrollArea>
  );
};

export default Test;
