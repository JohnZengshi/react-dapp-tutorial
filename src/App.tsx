/*
 * @LastEditors: John
 * @Date: 2024-01-03 08:51:29
 * @LastEditTime: 2024-03-08 11:41:29
 * @Author: John
 */
// import "./App.css";
import {
  Route,
  RouterProvider,
  Routes,
  createHashRouter,
} from "react-router-dom";
import Home from "./pages/Home";
import Participate from "./pages/Participate";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useRef } from "react";
import Profile from "./pages/Profile";
import Nav from "./components/common/Nav";
import ConnectWallet from "./components/common/ConnectWallet";
import { useAppDispatch } from "./store/hooks";
import CustomDialog from "./components/common/CustomDialog";
import flexible from "./utils/flexible";
import { SET_IS_SMALL_SCREEN } from "./store/sys";
import Points from "./pages/Points";
import Leaderboard from "./pages/Leaderboard";
import Test from "./pages/Test";
import { WalletProvider } from "./components/WalletProvider";

const App = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    flexible(window, document, (isSmall) => {
      dispatch(SET_IS_SMALL_SCREEN(isSmall));
    });
    console.log("env MODE:", import.meta.env.MODE);
    console.log("VITE_BASE_URL", import.meta.env.VITE_BASE_URL);
    console.log("render");
  }, []);
  return (
    <WalletProvider>
      <div className="App">
        <Nav connectBtn={<ConnectWallet />} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/participate" element={<Participate />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/points" element={<Points />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/test" element={<Test />} />
        </Routes>
        <Toaster />
        <CustomDialog />
      </div>
    </WalletProvider>
  );
};

export default App;
