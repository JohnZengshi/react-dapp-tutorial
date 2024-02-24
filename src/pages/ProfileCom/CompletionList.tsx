import './CompletionList.scss'
import './CompletionList-m.scss'
import { useEffect, useState } from 'react'
import { API_RECOMMEND_LIST, API_RECOMMEND_LIST_ITEM, API_RECOMMEND_LIST_PARAMS } from '@/utils/api'

const DEFAULTPAGINATION: API_RECOMMEND_LIST_PARAMS = {
    page: 1,
    size: 5
}

export const CompletionList = () => {

    const [pagination, setPagination] = useState<API_RECOMMEND_LIST_PARAMS>(DEFAULTPAGINATION)
    const [list, setList] = useState<Array<API_RECOMMEND_LIST_ITEM>>([])

    const handleQueryList = async (params: API_RECOMMEND_LIST_PARAMS) => {
        const result = await API_RECOMMEND_LIST(params)
        setList(result)
    }

    useEffect(() => {
        handleQueryList(DEFAULTPAGINATION)
    }, [])

    const renderOdyssey = (type: 1 | 2 | 3 | 4 | 5) => {
        switch (type) {
            case 1:
                return '链接钱包';
            case 2:
                return '关注推特';
            case 3:
                return '加入TG';
            case 4:
                return '加入Discord ';
            case 5:
                return '邀请获得积分';
        }
    }

    return <ul className='CompletionListBox'>
        <li className='header'>
            <div className='item'>Rank</div>
            <div className='line' />
            <div className='item'>Address</div>
            <div className='line' />
            <div className='item'>Odyssey</div>
            <div className='line' />
            <div className='item'>Points</div>
        </li>
        {
            list.map((item, index) => <li>
                <div className='item'>{index + 1}</div>
                <div className='line' />
                <div className='item'>{item.address}</div>
                <div className='line' />
                <div className='item'>{renderOdyssey(item.type)}</div>
                <div className='line' />
                <div className='item'>{item.number}</div>
            </li>)
        }
    </ul>
}

export default CompletionList