import React, { useContext } from 'react';
import ThemeContext from '../ThemeContext';
import './base.css';

/**
 * The base component which provides the standardised layout for each page in the website.
 * @param {Object} props - the component props.
 * @returns - the base component.
 */
const Base = (props) => {
    const { theme, fontSize } = useContext(ThemeContext); 
    
    const cardClass = `card ${theme}-theme ${fontSize}-font`;

    return (
        <div className={cardClass}>
            <div className="card-body">
                {props.children}
            </div>
        </div>
    );
}

export default Base;
