import "./App.css";
import ConnectWallet from "@/components/common/ConnectWallet";
import MetaMask from "./wallet/MetaMask";
import Okx from "./wallet/UseOkx";
import UniSat from "./wallet/UseUniSat";

const App = () => {
  return (
    <div className="App">
      {/* <MetaMask/> */}
      {/* <UniSat /> */}
      {/* <Okx /> */}
      <ConnectWallet className="mt-10" />
    </div>
  );
};

export default App;
