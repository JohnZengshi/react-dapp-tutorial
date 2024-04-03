/*
 * @LastEditors: John
 * @Date: 2024-01-03 10:05:18
 * @LastEditTime: 2024-04-03 17:24:50
 * @Author: John
 */

import "./Home.scss";
import "./Home-m.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Player } from "@lottiefiles/react-lottie-player";
import lottie1 from "@/assets/lottie/lottie1.json";
import ExperienceTip from "@/components/common/ExperienceTip";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  Fragment,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import IconFont, { IconNames } from "@/components/iconfont";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import homeTopBg from "@/assets/svg/homeTopBg.svg";

import {
  DOMKeyframesDefinition,
  motion,
  useAnimate,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { SET_HOME_SCROLL_Y_PROGRESS } from "@/store/sys";
import { HOMEPAGE_THRESHOLD } from "@/constant";
import Tech1 from "@/assets/svg/Tech1.svg";
import Tech2 from "@/assets/svg/Tech2.svg";
import Tech3 from "@/assets/svg/Tech3.svg";

import Guidance_1 from "@/assets/svg/Guidance_1.svg";
import Guidance_2 from "@/assets/svg/Guidance_2.svg";
import Guidance_3 from "@/assets/svg/Guidance_3.svg";

import effect_box from "@/assets/svg/effect_box.svg";
import event3 from "@/assets/svg/event-03.svg";

import techBg from "@/assets/svg/techBg.svg";
import CustomToast from "@/components/common/CustomToast";
import { THIRD_URL } from "@/constant/thirdUrl";
import Slider from "react-slick";

export default function () {
  const dispatch = useAppDispatch();
  const isSmallScreen = useAppSelector((state) => state.sys.isSmallScreen);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null!);

  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [subPage, setSubPage] = useState(1);

  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // console.log("Page scroll: ", latest);
    const progress: number = latest;
    setProgress(parseFloat(progress.toFixed(2)));
    dispatch(SET_HOME_SCROLL_Y_PROGRESS(parseFloat(progress.toFixed(2))));
  });

  useEffect(() => {
    console.log("scroll progress:", progress);
    if (progress == HOMEPAGE_THRESHOLD.theEnd) {
      // console.log("到底了");
    } else if (progress >= HOMEPAGE_THRESHOLD.fifthScreen) {
      // console.log("第五屏");
      setCurrentPage(5);
    } else if (progress >= HOMEPAGE_THRESHOLD.fourthScreen) {
      // console.log("第四屏");
      setCurrentPage(4);
    } else if (progress >= HOMEPAGE_THRESHOLD.thirdScreen) {
      // console.log("第三屏");
      // console.log("第三屏", progress);
      if (progress >= HOMEPAGE_THRESHOLD.thirdOfThirdScreen) {
        // console.log("第三屏的第三屏", progress);
        setSubPage(3);
      } else if (progress >= HOMEPAGE_THRESHOLD.secondOfThirdScreen) {
        // console.log("第三屏的第二屏", progress);
        setSubPage(2);
      } else {
        // console.log("第三屏的第一屏", progress);
        setSubPage(1);
      }
      setCurrentPage(3);
    } else if (progress >= HOMEPAGE_THRESHOLD.secondScreen) {
      // console.log("第二屏");
      setCurrentPage(2);
    } else {
      // console.log("第一屏");
      setCurrentPage(1);
    }

    return () => {};
  }, [progress]);

  return (
    <>
      {!false ? (
        <div
          className="Home relative snap-y snap-mandatory h-[100vh] overflow-y-scroll scroll-smooth"
          ref={containerRef}
        >
          <Top />
          <Guidance active={currentPage == 2} />
          <div
            className="w-full h-[300vh] flex flex-col snap-center relative snap-mandatory"
            id="TECHNOLOGY_ARCHITECTURE_PAG1"
          >
            <TechnologyArchitecture activeSub={subPage} />
            <motion.div
              onViewportEnter={() => {
                console.log("ele1 show!");
              }}
              onViewportLeave={() => {
                console.log("ele1 hide!");
              }}
              className="w-full h-[100vh] bg-slate-400 snap-center"
              id="TECHNOLOGY_ARCHITECTURE_PAG2"
            ></motion.div>
            <motion.div
              onViewportEnter={() => {
                console.log("ele2 show!");
              }}
              className="w-full h-[100vh] bg-slate-600 snap-center"
              id="TECHNOLOGY_ARCHITECTURE_PAG3"
            ></motion.div>
          </div>
          <EventNews active={currentPage == 4} />
          <Community active={currentPage == 5} />
          <Footer />
        </div>
      ) : (
        <ExperienceTip />
      )}
    </>
  );
}
// 页面
export const Top = ({}: PropsWithChildren<{}>) => {
  return (
    <div className={cn("TOP h-[100vh] flex flex-col snap-center relative")}>
      <div className="container flex flex-row relative z-10">
        <div className="left flex flex-col">
          <div className="big_text flex flex-col">
            <motion.div
              className="flex flex-row"
              initial={{ y: 50 }}
              whileInView={{
                y: 0,
                transition: {
                  type: "spring",
                  bounce: 0.4,
                  duration: 0.8,
                  delay: 0.1,
                },
              }}
            >
              <span>Scaling &nbsp;</span>
              <span>Bitcoin </span>
            </motion.div>
            <motion.span
              initial={{ y: 50 }}
              whileInView={{
                y: 0,
                transition: {
                  type: "spring",
                  bounce: 0.4,
                  duration: 0.8,
                  delay: 0.2,
                },
              }}
            >
              Without&nbsp;Compromise
            </motion.span>
          </div>
          <motion.div className="small_text flex flex-col">
            <motion.span
              initial={{ y: 50 }}
              whileInView={{
                y: 0,
                transition: {
                  type: "spring",
                  bounce: 0.4,
                  duration: 0.8,
                  delay: 0.3,
                },
              }}
            >
              lnstant, Economical, Unlimited Storage.
            </motion.span>
          </motion.div>
        </div>
        <motion.div
          className="right"
          initial={{ x: 100 }}
          whileInView={{
            x: 0,
            transition: {
              type: "spring",
              bounce: 0.4,
              duration: 2,
            },
          }}
        >
          <Player
            autoplay
            loop
            src={lottie1}
            className="lottie_animation"
          ></Player>
        </motion.div>
      </div>
      <motion.div className="sliding mx-auto flex flex-row items-center justify-between w-full relative z-20">
        {/* <div className="left flex flex-row items-center">
          <span>Layer</span>
          <span>&nbsp;/&nbsp;</span>
          <span>02</span>
        </div> */}
        <motion.div
          className="mid flex flex-row items-center justify-center w-full"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{
            type: "spring",
            bounce: 0.4,
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <span>Sliding</span>
          <div
            className="btn1 flex justify-center items-center"
            onClick={() => {
              document.querySelector(`#PAGE_GUIDANCE`)?.scrollIntoView();
            }}
          >
            <IconFont name="xiangxiajiantou" size={12} color="#000000" />
          </div>
        </motion.div>
        {/* <div className="btn2 flex justify-center items-center">
          <IconFont name="xiangzuojiantou" size={12} color="#fff" />
        </div> */}
      </motion.div>
      <img
        src={homeTopBg}
        className="gapbg absolute top-0 z-0 w-full h-full object-cover"
      />
    </div>
  );
};

export const Guidance = ({
  active,
}: PropsWithChildren<{ active: boolean }>) => {
  return (
    <div
      className="GUIDANCE flex flex-col items-center justify-center  h-[100vh] snap-center relative"
      id="PAGE_GUIDANCE"
    >
      {/* <img src={techBg} className="w-full absolute top-0 left-0" alt="" /> */}
      <motion.span
        className="t1"
        initial={{ y: -50 }}
        whileInView={{
          y: 0,
          transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.8,
            delay: 0.3,
          },
        }}
      >
        The First Modular Layer2 to Scale Bitcoin's Computing and Storage based
        on ZK Technology
      </motion.span>
      <ul className="btns flex flex-row items-center relative">
        <motion.li
          className="btn flex justify-center items-center cursor-pointer"
          initial={{ y: -50 }}
          whileInView={{
            y: 0,
            transition: {
              type: "spring",
              bounce: 0.4,
              duration: 0.8,
              delay: 0.1,
            },
          }}
          onClick={() => window.open(THIRD_URL.GITBOOK, "_blank")}
        >
          <IconFont name="book" color="#000000" />
          <span>Documentation </span>
        </motion.li>
        <motion.li
          className="btn flex justify-center items-center cursor-pointer"
          initial={{ y: -50 }}
          whileInView={{
            y: 0,
            transition: {
              type: "spring",
              bounce: 0.4,
              duration: 0.8,
              delay: 0.2,
            },
          }}
          onClick={() => CustomToast("Coming soog")}
        >
          <IconFont name="github" color="#000000" />
          <span>GitHub </span>
        </motion.li>
        <motion.li
          className="btn active flex justify-center items-center cursor-pointer"
          initial={{ y: -50 }}
          whileInView={{
            y: 0,
            transition: {
              type: "spring",
              bounce: 0.4,
              duration: 0.8,
              delay: 0.3,
            },
          }}
          onClick={() => CustomToast("Coming soog")}
        >
          <IconFont name="diqiu" color="#fff" />
          <span>Alpha Testnet </span>
        </motion.li>
      </ul>
      <div className="cards flex flex-col">
        <motion.li
          className={cn("card1 flex flex-row justify-between")}
          initial={{ y: 20, opacity: 0 }}
          whileInView={{
            y: 0,
            opacity: 1,
            transition: {
              type: "spring",
              bounce: 0.4,
              duration: 0.8,
              delay: 0.1 * 1,
            },
          }}
        >
          <div className="textContainer flex flex-col">
            <span>Scale Without Compromise</span>
            <span
              className={cn(
                "text-ellipsis overflow-hidden whitespace-pre-wrap",
                "line-clamp-6"
              )}
            >
              Inherit Bitcoin-level security through Bitcoin's POW at L1 and
              Zero-Knowledge Proofs at L2.Turing-completeness,Type2
              ZK-EVM,migrate EVM-based dApps to ROOS effortlessly.Unlock
              Bitcoin's computing and storage capabilities to empower the next
              billion users and revolutionize decentralized applications for the
              future.
            </span>
          </div>
          <div className="guidance_1 img bg-cover bg-center"></div>
        </motion.li>
        <div className="bottom flex flex-row">
          <GuidanceCard
            index={2}
            title="Modular Architecture"
            content="The overall architecture of ROOS Network adopts a modular design to drive the Bitcoin ecosystem's limitless growth, striking an optimal balance between scalability, security, and decentralization. It consists of three key modules: ROOS BTCLayer, ROOS BTCStorage, and ROOS Bridge."
            liClassName="flex flex-1 flex-col justify-between"
            contentClassName="line-clamp-4"
          />
          <GuidanceCard
            index={3}
            title="Decentralized From Day One"
            content="Decentralization is in our DNA. We make zero compromises in achieving scalability, and sequencing will be completely decentralized from Day1 on the mainnet - creating a network that is not only easy to participate in, but one that's unstoppable."
            liClassName="flex flex-1 flex-col justify-between"
            contentClassName="line-clamp-4"
          />
        </div>
      </div>
    </div>
  );
};

export const TechnologyArchitecture = ({
  activeSub,
  contanerClassName,
}: PropsWithChildren<{
  activeSub: number;
  contanerClassName?: string;
}>) => {
  const [currentSubActive, setCurrentSubActive] = useState(1);
  useEffect(() => {
    setCurrentSubActive(activeSub);
    return () => {};
  }, [activeSub]);

  return (
    <>
      <div
        className={cn(
          "TECHNOLOGY_ARCHITECTURE box-border flex flex-col items-center justify-center w-full h-[100vh] sticky top-0",
          currentSubActive == 2 ? "bg-[#262626]" : "bg-[#1C1C1C]"
        )}
      >
        <img
          src={techBg}
          className="w-full absolute top-0 left-0 opacity-20"
          alt=""
        />
        <div className={cn("top flex items-center w-full")}>
          {activeSub == 1 && (
            <motion.span
              className={cn("cursor-pointer")}
              onClick={() => {
                setCurrentSubActive(1);
                document
                  .querySelector(`#TECHNOLOGY_ARCHITECTURE_PAG1`)
                  ?.scrollIntoView();
              }}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{
                y: 0,
                opacity: 1,
                transition: {
                  type: "spring",
                  bounce: 0.4,
                  duration: 0.8,
                  delay: 0.1,
                },
              }}
            >
              Status Quo&nbsp;&nbsp;
            </motion.span>
          )}

          {activeSub == 2 && (
            <motion.span
              className={cn("cursor-pointer")}
              onClick={() => {
                setCurrentSubActive(2);
                document
                  .querySelector(`#TECHNOLOGY_ARCHITECTURE_PAG2`)
                  ?.scrollIntoView();
              }}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{
                y: 0,
                opacity: 1,
                transition: {
                  type: "spring",
                  bounce: 0.4,
                  duration: 0.8,
                  delay: 0.2,
                },
              }}
            >
              With Espresso&nbsp;&nbsp;
            </motion.span>
          )}

          {activeSub == 3 && (
            <motion.span
              className={cn("cursor-pointer")}
              onClick={() => {
                setCurrentSubActive(3);
                document
                  .querySelector(`#TECHNOLOGY_ARCHITECTURE_PAG3`)
                  ?.scrollIntoView();
              }}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{
                y: 0,
                opacity: 1,
                transition: {
                  type: "spring",
                  bounce: 0.4,
                  duration: 0.8,
                  delay: 0.3,
                },
              }}
            >
              The Future
            </motion.span>
          )}
        </div>
        <div className="t_container flex flex-row w-full">
          <div className="left flex items-center justify-center flex-auto box-border">
            {currentSubActive == 1 && (
              <motion.img
                className="h-full"
                src={Tech1}
                alt=""
                initial={{ y: 20, opacity: 0 }}
                whileInView={{
                  y: 0,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    bounce: 0.4,
                    duration: 0.8,
                    delay: 0.2,
                  },
                }}
              />
            )}
            {currentSubActive == 2 && (
              <motion.img
                className="h-full"
                src={Tech2}
                alt=""
                initial={{ y: 20, opacity: 0 }}
                whileInView={{
                  y: 0,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    bounce: 0.4,
                    duration: 0.8,
                    delay: 0.2,
                  },
                }}
              />
            )}
            {currentSubActive == 3 && (
              <motion.img
                className="h-full"
                src={Tech3}
                alt=""
                initial={{ y: 20, opacity: 0 }}
                whileInView={{
                  y: 0,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    bounce: 0.4,
                    duration: 0.8,
                    delay: 0.2,
                  },
                }}
              />
            )}
          </div>
          <div className="right">
            <ul className="flex flex-col h-full">
              {Array.from({ length: 4 }).map((v, _i) => (
                <Fragment key={_i}>
                  <motion.li
                    className="flex-1"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{
                      y: 0,
                      opacity: 1,
                      transition: {
                        type: "spring",
                        bounce: 0.4,
                        duration: 0.8,
                        delay: 0.2 * (_i + 1),
                      },
                    }}
                    viewport={{ once: true }}
                  >
                    <span>Espresso's HotShot finality</span>
                    <span>
                      Espresso's HotShot finality gadget is optimistically
                      responsive and guarantees fast transaction finality and
                      throughput limited only by network bandwidth.
                    </span>
                  </motion.li>
                </Fragment>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export const EventNews = ({
  active,
}: PropsWithChildren<{ active: boolean }>) => {
  const sliderRef = useRef<Slider>(null);
  return (
    <div className="EVENT_NEWS BASE_TITLE flex-col flex items-center justify-center h-[100vh] snap-center bg-[#262626] relative">
      <img
        src={techBg}
        className="w-full absolute top-0 left-0 opacity-20"
        alt=""
      />
      <motion.span
        className="t1 text-[#fff]"
        initial={{ y: -20 }}
        whileInView={{
          y: 0,
          transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.8,
            delay: 0.1,
          },
        }}
      >
        Event & News
      </motion.span>
      <motion.span
        className="t2 text-[#fff]"
        initial={{ y: -20 }}
        whileInView={{
          y: 0,
          transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.8,
            delay: 0.2,
          },
        }}
      >
        Bitlayer Ecosystem Event & News
      </motion.span>
      <motion.span
        className="t3 text-[#FFC100]"
        initial={{ y: -20 }}
        whileInView={{
          y: 0,
          transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.8,
            delay: 0.3,
          },
        }}
      >
        Follow up our updates
      </motion.span>
      <motion.div
        className="list slider-container"
        initial={{ opacity: 1, scale: 0 }}
        whileInView={{
          opacity: 1,
          scale: 1,
        }}
      >
        <Slider
          {...{
            dots: false,
            infinite: false,
            arrows: false,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 3,
            ref: sliderRef,
          }}
        >
          {Array.from({ length: 4 }).map((v, i) => (
            <EventNewsCard
              i={i}
              key={i}
              onClick={() => window.open(THIRD_URL.TWITTER, "_blank")}
            />
          ))}
        </Slider>
      </motion.div>
      <div className="indicator flex flex-row items-center">
        <motion.div
          className="left flex justify-center items-center cursor-pointer"
          onClick={() => {
            sliderRef.current?.slickPrev();
          }}
          whileHover={{
            backgroundColor: "#ffc100",
            scale: 1.1,
            transition: {
              type: "spring",
              bounce: 0.4,
              duration: 0.8,
            },
          }}
        >
          <IconFont name="arrow-left" size={19} color="#fff" />
        </motion.div>
        <motion.div
          className="right flex justify-center items-center cursor-pointer"
          onClick={() => {
            sliderRef.current?.slickNext();
          }}
          whileHover={{
            backgroundColor: "#ffc100",
            scale: 1.1,
            transition: {
              type: "spring",
              bounce: 0.4,
              duration: 0.8,
            },
          }}
        >
          <IconFont name="arrow-right" size={19} color="#fff" />
        </motion.div>
      </div>
    </div>
  );
};

export const Community = ({
  active,
}: PropsWithChildren<{ active: boolean }>) => {
  return (
    <div className="COMMUNITY BASE_TITLE flex-col flex items-center justify-center h-[100vh] snap-center">
      <motion.span
        className="t1"
        initial={{ y: -20 }}
        whileInView={{
          y: 0,
          transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.8,
            delay: 0.1,
          },
        }}
      >
        Community
      </motion.span>
      <motion.span
        className="t2"
        initial={{ y: -20 }}
        whileInView={{
          y: 0,
          transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.8,
            delay: 0.2,
          },
        }}
      >
        Join The Community of The Future
      </motion.span>
      <motion.span
        className="t3 text-[#FFC100]"
        initial={{ y: -20 }}
        whileInView={{
          y: 0,
          transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.8,
            delay: 0.3,
          },
        }}
      >
        stay active with bitlayer any
      </motion.span>

      <motion.ul className="joinList flex flex-row flex-wrap justify-between">
        <JoinCard
          i={1}
          t1="Starts On Github"
          t2="build with us"
          iconName="github"
          onClick={() => CustomToast("Coming soog")}
        />
        <JoinCard
          i={2}
          t1="join the discord"
          t2="Community"
          iconName="discord"
          onClick={() => CustomToast("Coming soog")}
        />
        <JoinCard
          i={3}
          t1="follow on x"
          t2="build with us"
          iconName="a-xinbantuitewuyuanjiao"
          onClick={() => window.open(THIRD_URL.TWITTER, "_blank")}
        />
        <JoinCard
          i={4}
          t1="connect on linkedin"
          t2="connect with us"
          iconName="instagram"
          onClick={() => CustomToast("Coming soog")}
        />
        <JoinCard
          i={5}
          t1="join our telegarm"
          t2="chat with us"
          iconName="telegram"
          onClick={() => CustomToast("Coming soog")}
        />
        <JoinCard
          i={6}
          t1="stay up in medium"
          t2="learn with us"
          iconName="medium"
          onClick={() => window.open(THIRD_URL.MEDIUM, "_blank")}
        />
      </motion.ul>
    </div>
  );
};

export const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className="FOOTER flex flex-col mt-auto snap-center">
      <div className="container flex flex-row flex-auto items-center">
        <div className="left flex flex-col">
          <IconFont
            size={142}
            className="logo"
            name="roos"
            onClick={() => {
              navigate("/");
            }}
          />

          <div className="des flex flex-col">
            <span>Did team leverages decentralized</span>
            <span>identity to empower identity</span>
            <span>building and community growth</span>
          </div>
        </div>
        <div className="right flex flex-row items-center">
          <ul className="links flex flex-row">
            <li className="item flex flex-col">
              <span className="cursor-pointer">Products</span>
              <span className="cursor-pointer">Roos</span>
              <span className="cursor-pointer">Roos Profile</span>
              <span className="cursor-pointer">Voty</span>
              <span className="cursor-pointer">SoulFrag</span>
            </li>
            <li className="item flex flex-col">
              <span className="cursor-pointer">Company</span>
              <span className="cursor-pointer">About</span>
              <span className="cursor-pointer">Join us</span>
              <span className="flex flex-row items-center cursor-pointer">
                Voty&nbsp;&nbsp;
                <IconFont name="lianjiejiantou" color={"#fff"} />
              </span>
              <span className="flex flex-row items-center cursor-pointer">
                Media kit&nbsp;&nbsp;
                <IconFont name="lianjiejiantou" color={"#fff"} />
              </span>
            </li>
            <li className="item flex flex-col">
              <span>News & more</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="bottom flex flex-row items-center justify-center">
        <span>© 2024 Roos, ALL RIGHTS RESERVED, AN EIGENLABS PROJECT</span>
      </div>
    </div>
  );
};

// 组件
export const GuidanceCard = ({
  index,
  title,
  content,
  liClassName,
  contentClassName,
  onClick,
}: PropsWithChildren<{
  index: number;
  title: string;
  content: string;
  liClassName?: string;
  contentClassName?: string;
  onClick?: () => void;
}>) => {
  return (
    <motion.li
      className={cn("card", liClassName)}
      initial={{ y: 20, opacity: 0 }}
      whileInView={{
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          bounce: 0.4,
          duration: 0.8,
          delay: 0.1 * index,
        },
      }}
      onClick={onClick}
    >
      <div className="textContainer flex flex-col">
        <span>{title}</span>
        <span
          className={cn(
            "text-ellipsis overflow-hidden whitespace-pre-wrap",
            contentClassName
          )}
        >
          {content}
        </span>
      </div>
      {index == 2 && <div className="guidance_2 img bg-cover bg-center"></div>}
      {index == 3 && <div className="guidance_3 img bg-cover bg-center"></div>}
    </motion.li>
  );
};

export const EventNewsCard = ({
  i,
  onClick,
}: PropsWithChildren<{ i: number; onClick?: () => void }>) => {
  const [scope, animate] = useAnimate();
  return (
    <motion.div
      className="EFFECT_BOX relative w-fit m-auto cursor-pointer"
      initial={{ y: 20, opacity: 0 }}
      whileInView={{
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          bounce: 0.4,
          duration: 0.8,
          delay: 0.1 * i,
        },
      }}
      onClick={onClick}
    >
      <motion.div
        className="context item flex flex-col items-center bg-[#262626]"
        whileHover={{
          x: -10,
          y: -10,
          backgroundColor: "#ffc100",
          transition: { type: "spring", bounce: 0.4, duration: 0.8 },
        }}
        onHoverStart={() => {
          animate(scope.current, {
            x: 10,
            y: 10,
            opacity: 1,
          } as DOMKeyframesDefinition);
        }}
        onHoverEnd={() => {
          animate(scope.current, {
            x: 0,
            y: 0,
            opacity: 0,
          } as DOMKeyframesDefinition);
        }}
      >
        <img className="container" src={event3}></img>
        <div className="bottom flex flex-row justify-between w-full">
          <span className="text-[#fff]">0{i + 1}</span>
          <span className="text-[#fff]">BITCOIN SINGAPORE</span>
        </div>
      </motion.div>
      <img
        ref={scope}
        className="effectLine object-cover"
        src={effect_box}
      ></img>
    </motion.div>
  );
};

export const JoinCard = ({
  i,
  t1,
  t2,
  iconName,
  onClick,
}: PropsWithChildren<{
  i: number;
  t1: string;
  t2: string;
  iconName: IconNames;
  onClick?: () => void;
}>) => {
  const [scope, animate] = useAnimate();
  return (
    <motion.li
      className="EFFECT_BOX item relative cursor-pointer"
      initial={{ y: 20, opacity: 0 }}
      whileInView={{
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          bounce: 0.4,
          duration: 0.8,
          delay: 0.1 * i,
        },
      }}
      onClick={onClick}
    >
      <motion.div
        className="context flex flex-row items-center w-full h-full"
        whileHover={{
          x: -5,
          y: -5,
          backgroundColor: "#ffc100",
          transition: { type: "spring", bounce: 0.4, duration: 0.8 },
        }}
        onHoverStart={() => {
          animate(scope.current, {
            x: 5,
            y: 5,
            opacity: 1,
          } as DOMKeyframesDefinition);
        }}
        onHoverEnd={() => {
          animate(scope.current, {
            x: 0,
            y: 0,
            opacity: 0,
          } as DOMKeyframesDefinition);
        }}
      >
        <motion.div className="left flex flex-col items-start">
          <span className="text-nowrap">{t1}</span>
          <span>{t2}</span>
        </motion.div>
        <IconFont name={iconName} className="right ml-auto" color="#000" />
      </motion.div>
      <div ref={scope} className="effectLine border border-black"></div>
    </motion.li>
  );
};
