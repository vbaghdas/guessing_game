import React from 'react';

export default (props) => {
    const { guess, result } = props.item;
    
    let bootStrapClass = 'justify-content-center list-group-item list-group-item-';

    switch(result){
        case 'Too High':
            bootStrapClass += 'info';
            break;
        case 'Too Low':
            bootStrapClass += 'danger';
            break;
        default:
            bootStrapClass += 'success';
    }

    return <li style={{'fontSize': '1.25em'}} className={bootStrapClass}><b>{guess} | {result}</b></li>;
}