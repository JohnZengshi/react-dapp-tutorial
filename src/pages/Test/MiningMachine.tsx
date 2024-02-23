import "./MiningMachine.scss";
import "./MiningMachine-m.scss";

export const MiningMachine = () => {

    const handleSubmit = () => { }

    return <div className="MiningMachineBox">
        <p className="title">Assemble a mining machine</p>
        <div className="footer">
            <div className="costBox">
                <span className="sub">Cost</span>
                <span className="sup">20</span>
                <span className="sub">Accessories</span>
            </div>
            <div className="submitBtn" onClick={handleSubmit}>
                Assembling mining machine
            </div>
        </div>
    </div>
}

export default MiningMachine