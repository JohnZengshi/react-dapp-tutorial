import { ScrollArea } from "@/components/ui/scroll-area"
import NftsAccessories from "./Test/NftsAccessories";
import MiningMachine from "./Test/MiningMachine";
import Machine from "./Test/Machine";
import Recommend from "./Test/Recommend";
import CompletionList from "./Test/CompletionList";
import GetNftBox from "./Test/GetNftBox";
import "./Test.scss";
import "./Test-m.scss";

export const Test = () => {

    return <ScrollArea className="Test">
        {/* 页面1 */}
        <div className="content box-border">
            <div className="accessoriesContainer">
                <p className="title">My NFT accessories</p>
                <div className='header'>
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
}

export default Test