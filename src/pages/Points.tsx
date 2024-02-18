/*
 * @LastEditors: John
 * @Date: 2024-02-18 13:47:39
 * @LastEditTime: 2024-02-18 16:21:21
 * @Author: John
 */
import "./Points.scss";
import point_task1_img from "@/assets/point_task1_img.png";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { SET_NOTIFICATION_TRIGGER_EVENT } from "@/store/reducer";

export default function () {
  return (
    <>
      <ScrollArea className="Points box-border">
        <div className="content">
          <div className="introduce">
            <p>Earn Reward Points</p>
            <p>
              Invite your friends to join a Bitcoin layer2 party. Earn points,
              get exclusive rewards and share the fun! Let's make the Bitcoin
              ecosystem a better place!
            </p>
          </div>

          <div className="title">
            <span>My Points</span>
            <span>0</span>
          </div>

          <div className="taskPart">
            <div className="coverimg">
              <img src={point_task1_img} alt="" />
              <span>Know B² Network</span>
            </div>
            <ul className="tasklist">
              <TaskItem />
              <TaskItem />
              <TaskItem />
            </ul>
          </div>
        </div>
      </ScrollArea>
    </>
  );
}

function TaskItem() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  return (
    <li className="item">
      <div className="appicon"></div>
      <span className="taskName">
        Send a Red Envelope and share it on Twitter
      </span>
      <div className="getpoints">
        <span>+20</span>
        <span>RBIT</span>
      </div>
      <Button
        className="btn"
        onClick={() => {
          if (!user.wallet.address) {
            // TODO 选择钱包弹窗✔
            dispatch(
              SET_NOTIFICATION_TRIGGER_EVENT("SELECT_WALLET_MULTI_CHAIN")
            );

            return;
          }
        }}
      >
        {user.wallet.address ? "Get 50 Points" : "Connent wallet"}
      </Button>
    </li>
  );
}
