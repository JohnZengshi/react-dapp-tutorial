/*
 * @LastEditors: John
 * @Date: 2024-03-08 09:44:08
 * @LastEditTime: 2024-04-01 18:25:10
 * @Author: John
 */
import IconFont, { IconNames } from "../iconfont";
import CustomToast from "./CustomToast";
import "./CustomNavigationMenu.scss";
import { Fragment, useEffect, useState } from "react";
import { HOMEPAGE_THRESHOLD } from "@/constant";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

export default function (props: {
  title: string;
  titleCallBack?: () => void;
  itemList?: { title: string; icon?: IconNames; callBack?: () => void }[];
}) {
  const HomeScrollYProgress = useAppSelector(
    (state) => state.sys.HomeScrollYProgress
  );
  const location = useLocation();
  const [homeCurrentPage, setHomeCurrentPage] = useState(1);

  useEffect(() => {
    // console.log("scroll progress:", progress);
    if (HomeScrollYProgress == HOMEPAGE_THRESHOLD.theEnd) {
      // console.log("到底了");
    } else if (HomeScrollYProgress >= HOMEPAGE_THRESHOLD.fifthScreen) {
      // console.log("第五屏");
      setHomeCurrentPage(5);
    } else if (HomeScrollYProgress >= HOMEPAGE_THRESHOLD.fourthScreen) {
      // console.log("第四屏");
      setHomeCurrentPage(4);
    } else if (HomeScrollYProgress >= HOMEPAGE_THRESHOLD.thirdScreen) {
      // console.log("第三屏");
      // console.log("第三屏", progress);
      if (HomeScrollYProgress >= HOMEPAGE_THRESHOLD.thirdOfThirdScreen) {
        // console.log("第三屏的第三屏", progress);
        setHomeCurrentPage(3);
      } else if (
        HomeScrollYProgress >= HOMEPAGE_THRESHOLD.secondOfThirdScreen
      ) {
        // console.log("第三屏的第二屏", progress);
        setHomeCurrentPage(2);
      } else {
        // console.log("第三屏的第一屏", progress);
        setHomeCurrentPage(1);
      }
      setHomeCurrentPage(3);
    } else if (HomeScrollYProgress >= HOMEPAGE_THRESHOLD.secondScreen) {
      // console.log("第二屏");
      setHomeCurrentPage(2);
    } else {
      // console.log("第一屏");
      setHomeCurrentPage(1);
    }

    return () => {};
  }, [HomeScrollYProgress]);

  return (
    <div className="CustomNavigationMenu">
      <button onClick={() => props.titleCallBack?.()}>
        <span
          className={cn(
            "transition-all",
            location.pathname == "/" &&
              (homeCurrentPage == 2 || homeCurrentPage == 5)
              ? "text-[#000]"
              : "text-[#fff]"
          )}
        >
          {props.title}
        </span>
        {props.itemList && (
          <>
            <IconFont
              name="arrow-down"
              color="#f58c00"
              className="arrowDown active"
            />
            <IconFont
              name="arrow-down"
              color={
                location.pathname == "/" &&
                (homeCurrentPage == 2 || homeCurrentPage == 5)
                  ? "#000"
                  : "#fff"
              }
              className="arrowDown"
            />
          </>
        )}
      </button>
      {props.itemList && (
        <>
          <div className="dropDownMeun">
            <div className="dropDownMeunContent">
              <ul>
                {props.itemList?.map((v, i) => (
                  <Fragment key={i}>
                    {v.icon ? (
                      <li onClick={() => v.callBack?.()}>
                        <IconFont
                          name={v.icon}
                          className="icon"
                          color="#EAEAEA"
                        />
                        <IconFont
                          name={v.icon}
                          className="icon active"
                          color={"#f58c00"}
                        />
                        <span>{v.title}</span>
                      </li>
                    ) : (
                      <li onClick={() => v.callBack?.()}>{v.title}</li>
                    )}
                  </Fragment>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
