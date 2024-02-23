import { ScrollArea } from "@/components/ui/scroll-area";
import NftsAccessories from "./ProfileCom/NftsAccessories";
import MiningMachine from "./ProfileCom/MiningMachine";
import Machine from "./ProfileCom/Machine";
import Recommend from "./ProfileCom/Recommend";
import CompletionList from "./ProfileCom/CompletionList";
import GetNftBox from "./ProfileCom/GetNftBox";
import "./Test.scss";
import "./Test-m.scss";

export const Test = () => {
  return (
    <ScrollArea className="Test">
      {/* 页面1 */}
      <div className="content box-border">
        <div className="accessoriesContainer">
          <p className="title">My NFT accessories</p>
          <div className="header">
            <div className="accessories">
              <NftsAccessories />
            </div>
            <div className="mining">
              <MiningMachine />
            </div>
          </div>
        </div>
        <div className="MachineContainer">
          <p className="title">My mining machine</p>
          <Machine />
        </div>
      </div>

      {/* 页面2 */}
      <div className="content box-border">
        <div className="recommendationContainer">
          <p className="title">My recommendation</p>
          <Recommend />
        </div>
        <div className="completionListContainer">
          <p className="title">Odyssey recommended completion list</p>
          <CompletionList />
        </div>
      </div>

      {/* 页面3 */}
      <div className="content box-border">
        <div className="GetNftsContainer">
          <GetNftBox />
        </div>
      </div>
    </ScrollArea>
  );
};

export default Test;
