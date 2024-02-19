/*
 * @LastEditors: John
 * @Date: 2024-02-19 10:56:03
 * @LastEditTime: 2024-02-19 17:02:00
 * @Author: John
 */
import "./Leaderboard.scss";
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

export default function () {
  return (
    <>
      <div className="Leaderboard">
        <div className="round"></div>
        <div className="content">
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
                    <li className="recentJoinsItem">
                      <div className="icon"></div>
                      <div className="mid">
                        <span>DorothyR16233</span>
                        <span>Invited by ThomasLisa98710</span>
                      </div>
                      <span className="time">3 mins ago</span>
                    </li>
                    <div className="line"></div>
                  </Fragment>
                ))}
              </ul>
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
}
