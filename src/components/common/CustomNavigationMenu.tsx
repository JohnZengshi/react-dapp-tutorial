import IconFont, { IconNames } from "../iconfont";
import CustomToast from "./CustomToast";
import "./CustomNavigationMenu.scss";

export default function (props: {
  title: string;
  titleCallBack?: () => void;
  itemList?: { title: string; icon?: IconNames; callBack?: () => void }[];
}) {
  return (
    <div className="CustomNavigationMenu">
      <button onClick={() => props.titleCallBack?.()}>
        <span>{props.title}</span>
        {props.itemList && (
          <>
            <IconFont
              name="arrow-down"
              color="#f58c00"
              className="arrowDown active"
            />
            <IconFont name="arrow-down" color="#FFFFFF" className="arrowDown" />
          </>
        )}
      </button>
      {props.itemList && (
        <>
          <div className="dropDownMeun">
            <div className="dropDownMeunContent">
              <ul>
                {props.itemList?.map((v, i) => (
                  <>
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
                  </>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
