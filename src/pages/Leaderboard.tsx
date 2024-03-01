/*
 * @LastEditors: John
 * @Date: 2024-02-22 17:14:33
 * @LastEditTime: 2024-02-29 11:31:55
 * @Author: John
 */
/*
 * @LastEditors: John
 * @Date: 2024-02-19 10:56:03
 * @LastEditTime: 2024-02-29 11:26:56
 * @Author: John
 */
import "./Leaderboard.scss";
import "./Leaderboard-m.scss";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Fragment } from "react";
import { isMobile } from "@/utils";
import { useAppSelector } from "@/store/hooks";
import RecentJoinsItem from "./LeaderboardCom/RecentJoinsItem";
import IconFont from "@/components/iconfont";
import ExperienceTip from "@/components/common/ExperienceTip";

export default function () {
  const isSmallScreen = useAppSelector((state) => state.sys.isSmallScreen);
  return (
    <>
      <div className="Leaderboard">
        {/* <div className="round"></div> */}
        <div className="content">
          {!isSmallScreen || !isMobile ? (
            <>
              <div className="list">
                <div className="top">
                  <span className="title">Leaderboard</span>
                </div>

                <ScrollArea className="table_content">
                  <Table delDiv>
                    <TableHeader className="sticky top-0 bg-secondary">
                      <TableRow>
                        <TableHead>RANK</TableHead>
                        <TableHead>NAME</TableHead>
                        <TableHead>INVITED BY</TableHead>
                        <TableHead>Contribution</TableHead>
                        <TableHead>POINTS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from({ length: 50 }).map((v, i) => (
                        <TableRow key={i}>
                          <TableCell>1</TableCell>
                          <TableCell>
                            <div className="name">
                              <div className="circular" />
                              <span>000</span>
                            </div>
                          </TableCell>
                          <TableCell>Luke</TableCell>
                          <TableCell>50,158,277</TableCell>
                          <TableCell align="right">50,158,277</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
              <div className="list">
                <div className="top">
                  <span className="title">Recent Joins</span>
                </div>
                <ScrollArea>
                  <ul className="recentJoinsList">
                    {Array.from({ length: 50 }).map((v, i) => (
                      <Fragment key={i}>
                        <RecentJoinsItem />
                        <div className="line"></div>
                      </Fragment>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            </>
          ) : (
            <ExperienceTip />
          )}
        </div>
      </div>
    </>
  );
}
