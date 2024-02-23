import './CompletionList.scss'
import './CompletionList-m.scss'

export const CompletionList = () => {

    const data = [{
        id: 1,
        address: '123123',
        odyssey: 'xxxx',
        points: '10'
    }, {
        id: 2,
        address: '123123',
        odyssey: 'xxxx',
        points: '10'
    }, {
        id: 3,
        address: '123123',
        odyssey: 'xxxx',
        points: '10'
    },]

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
            data.map(item => <li>
                <div className='item'>{item.id}</div>
                <div className='line' />
                <div className='item'>{item.address}</div>
                <div className='line' />
                <div className='item'>{item.odyssey}</div>
                <div className='line' />
                <div className='item'>{item.points}</div>
            </li>)
        }
    </ul>
}

export default CompletionList