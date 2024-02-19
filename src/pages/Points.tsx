/*
 * @LastEditors: John
 * @Date: 2024-02-18 13:47:39
 * @LastEditTime: 2024-02-19 10:45:50
 * @Author: John
 */
import "./Points.scss";
import point_task1_img from "@/assets/point_task1_img.png";
import point_task2_img from "@/assets/point_task2_img.png";
import point_task3_img from "@/assets/point_task3_img.png";
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
            <TaskCoverImg coverImg={point_task1_img} title="Know B² Network" />
            <ul className="tasklist">
              <TaskItem
                type={1}
                taskName="Send a Red Envelope and share it on Twitter"
                point={30}
              />
              <TaskItem
                type={1}
                taskName="Send a Red Envelope and share it on Twitter"
                point={30}
              />
              <TaskItem
                type={1}
                taskName="Send a Red Envelope and share it on Twitter"
                point={30}
              />
            </ul>
          </div>

          <div className="taskPart">
            <TaskCoverImg coverImg={point_task2_img} title="Share B² Network" />
            <ul className="tasklist">
              <TaskItem
                type={2}
                copyUrl="https://task.bsquared.network/leaderboard?code=******"
              />
              <TaskItem type={3} />
            </ul>
          </div>

          <div className="taskPart">
            <TaskCoverImg
              coverImg={point_task3_img}
              title="Try Bridge On B² Network"
            />
            <ul className="tasklist">
              <TaskItem
                type={1}
                taskName="Deposit BTC from Bitcoin Testnet to B² Testnet"
                point={30}
              />
              <TaskItem
                type={1}
                taskName="Withdraw BTC from B² Testnet to Bitcoin Testnet"
                point={30}
              />
              <span className="tasklist_des">
                This task requires a Bitcoin address for completion. Please
                ensure that your Bitcoin address is connected before proceeding?
              </span>
            </ul>
          </div>
        </div>
      </ScrollArea>
    </>
  );
}

function TaskItem(props: {
  type: 1 | 2 | 3;
  taskName?: string;
  point?: number;
  copyUrl?: string;
  inviteFriend?: number;
}) {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  return (
    <li className="item">
      <div className="appicon"></div>
      {props.type == 1 && (
        <>
          <span className="taskName">{props.taskName}</span>
          <div className="getpoints">
            <span>+{props.point}</span>
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
            {user.wallet.address
              ? `Get ${props.point} Points`
              : "Connent wallet"}
          </Button>
        </>
      )}
      {props.type == 2 && (
        <>
          <span className="copyUrl">{props.copyUrl}</span>
          <Button
            className="btn"
            onClick={() => {}}
            disabled={!!user.wallet.address}
          >
            Copy
          </Button>
        </>
      )}
      {props.type == 3 && (
        <>
          <div className="inviteFriend">
            <span>You Have Invited</span>
            <div className="number">
              <span>***</span>
              <span>Friends</span>
            </div>
            <span>
              Invited users, please complete Know B² Network tasks for a
              successful referral. Thank you!
            </span>
          </div>
        </>
      )}
    </li>
  );
}

function TaskCoverImg(props: { coverImg: string; title: string }) {
  return (
    <div className="coverimg">
      <img src={props.coverImg} alt="" />
      <span>{props.title}</span>
    </div>
  );
}
