import { Button } from "../ui/button";
import "./Nav.scss";
export default function (props: { connectBtn?: any }) {
  return (
    <>
      <div className="nav">
        <div className="nav_1">ROOS logo</div>
        <div className="nav_2">
          <div className="nav_2_1">
            <Button>
              <span>RoosNode</span>
              {/* <svg
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m3 5 3 3 3-3" stroke="white" strokeWidth="1.2"></path>
              </svg> */}
            </Button>
          </div>

          <div className="nav_2_1">
            <Button>
              <span>Ecosystems</span>
              {/* <svg
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m3 5 3 3 3-3" stroke="white" strokeWidth="1.2"></path>
              </svg> */}
            </Button>
          </div>

          <div className="nav_2_1">
            <Button>
              <span>Bridge</span>
              {/* <svg
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m3 5 3 3 3-3" stroke="white" strokeWidth="1.2"></path>
              </svg> */}
            </Button>
          </div>

          <div className="nav_2_1">
            <Button>
              <span>Airdrop</span>
              {/* <svg
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m3 5 3 3 3-3" stroke="white" strokeWidth="1.2"></path>
              </svg> */}
            </Button>
          </div>

          <div className="nav_2_1">
            <Button>
              <span>Journey</span>
              {/* <svg
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m3 5 3 3 3-3" stroke="white" strokeWidth="1.2"></path>
              </svg> */}
            </Button>
          </div>
        </div>
        <div className="nav_3">
          <div className="nav_3_1">
            {props.connectBtn ? (
              props.connectBtn
            ) : (
              <Button>
                EN
                <span>
                  {/* <svg
                    viewBox="0 0 12 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m3 5 3 3 3-3"
                      stroke="white"
                      strokeWidth="1.2"
                    ></path>
                  </svg> */}
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
