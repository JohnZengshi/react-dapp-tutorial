/*
 * @LastEditors: John
 * @Date: 2024-02-29 10:52:47
 * @LastEditTime: 2024-02-29 10:54:25
 * @Author: John
 */

import "./RecentJoinsItem.scss";
import "./RecentJoinsItem-m.scss";
export default function RecentJoinsItem() {
  return (
    <li className="recentJoinsItem">
      <div className="icon"></div>
      <div className="mid">
        <span>DorothyR16233</span>
        <span>Invited by ThomasLisa98710</span>
      </div>
      <span className="time">3 mins ago</span>
    </li>
  );
}
