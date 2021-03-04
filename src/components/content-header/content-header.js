import * as React from 'react';
import './content-header.scss';

export default function ContentHeader(props) {
  return (
    <div className='content-header-container' >
        <div className='header-title-container' >
            <h2>{props.name}</h2>
            <div className="header-img">
              <img src={props.HeaderImg} alt={props.alt} width="860" height="345" />
            </div>
        </div> 
    </div>
  );
};