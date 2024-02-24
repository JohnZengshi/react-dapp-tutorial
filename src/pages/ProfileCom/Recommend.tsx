import "./Recommend.scss";
import "./Recommend-m.scss";
import { useEffect, useState } from "react";
import { API_GET_MY_POINT, BOX_MY_POINT } from "@/utils/api";

export const Recommend = () => {

    const [state, setState] = useState<BOX_MY_POINT>()

    const initData = async () => {
        const result: BOX_MY_POINT = await API_GET_MY_POINT()
        setState(result)
    }

    useEffect(() => {
        initData()
    }, [])

    return <div className="Recommend">
        <div className="item">
            <span>{state?.iveFinished || '-'}</span>
            <span>I finished Odyssey</span>
        </div>
        <div className="line" />
        <div className="item">
            <span>{state?.recommend || '-'}</span>
            <span>recommend Finish</span>
        </div>
        <div className="line" />
        <div className="item">
            <span>{state?.myIntegral || '-'}</span>
            <span>My Oydssey points</span>
        </div>
        <div className="line" />
        <div className="item">
            <span>{state?.recommendationPoints || '-'}</span>
            <span>Recommended to get</span>
        </div>
    </div>
}

export default Recommend