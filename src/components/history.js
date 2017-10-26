import React from 'react';
import HistoryItem from './history_item';

export default props => {
    const items = props.list.map((item, index) => {
        return <HistoryItem key={index} item={item}/>
    });

    return (
        <ul className="list-group">
            {items}
        </ul>
    );
}