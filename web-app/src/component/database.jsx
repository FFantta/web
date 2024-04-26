import React, { useEffect, useState } from 'react';
import { renderStudyDatabase } from '../supabaseClient';
import { setCurrentStudy } from './participantData';
import SearchBar from './searchBar';
import './database.css';

/**
 * A database component which gets all the data in the database for a given study.
 * @param {string} currentStudy - the name of the current study.
 * @returns - the data entries for a given study.
 */
const Database = ({currentStudy}) => {
    // study data initialisation
    const [studyData, setStudyData] = useState(null);

    useEffect(() => {
        /**
         * Gets the data entries of a study from the database and sets it in the studyData variable.
         */
        const getStudyData = async () => {
            const d = await renderStudyDatabase(currentStudy);
            setStudyData(d);
        };

        if (currentStudy !== "No Study Selected") {
            getStudyData();
        }

    }, [currentStudy]);

    
    // no buttons show up if no study selected
    if (currentStudy === "No Study Selected") {
        return (
            <div className='databaseContainer'>
                <h3>'Please select a study above.'</h3>
            </div>
        );
    }
    // participants populate the page if study selected
    else {
        setCurrentStudy(currentStudy);

        return (
            <>
                <div className="searchBarContainer">
                    <SearchBar currentStudy={currentStudy} setStudyData={setStudyData} />
                </div>
                <div className='databaseContainer'>
                    {studyData !== null ? studyData : <h3>Loading...</h3>}
                </div>  
            </>

        );
    }
}

export default Database;