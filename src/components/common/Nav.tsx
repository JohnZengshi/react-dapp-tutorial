import "./Nav.css";
export default function (props: { connectBtn?: any }) {
  return (
    <>
      <div className="nav">
        <div className="nav_1">ROOS logo</div>
        <div className="nav_2">
          <div className="nav_2_1">
            <button>
              <span>RoosNode</span>
              <svg
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m3 5 3 3 3-3" stroke="white" strokeWidth="1.2"></path>
              </svg>
            </button>
          </div>

          <div className="nav_2_1">
            <button>
              <span>RoosNode</span>
              <svg
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m3 5 3 3 3-3" stroke="white" strokeWidth="1.2"></path>
              </svg>
            </button>
          </div>

          <div className="nav_2_1">
            <button>
              <span>Ecosystems</span>
              <svg
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m3 5 3 3 3-3" stroke="white" strokeWidth="1.2"></path>
              </svg>
            </button>
          </div>

          <div className="nav_2_1">
            <button>
              <span>Bridge</span>
              <svg
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m3 5 3 3 3-3" stroke="white" strokeWidth="1.2"></path>
              </svg>
            </button>
          </div>

          <div className="nav_2_1">
            <button>
              <span>Airdrop</span>
              <svg
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m3 5 3 3 3-3" stroke="white" strokeWidth="1.2"></path>
              </svg>
            </button>
          </div>

          <div className="nav_2_1">
            <button>
              <span>Journey</span>
              <svg
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m3 5 3 3 3-3" stroke="white" strokeWidth="1.2"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="nav_3">
          <div className="nav_3_1">
            {props.connectBtn ? (
              props.connectBtn
            ) : (
              <button>
                EN
                <span>
                  <svg
                    viewBox="0 0 12 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m3 5 3 3 3-3"
                      stroke="white"
                      strokeWidth="1.2"
                    ></path>
                  </svg>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
