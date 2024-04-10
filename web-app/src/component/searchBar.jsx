import React, { useEffect, useState } from 'react';
import { renderSearchResults, renderStudyDatabase } from '../supabaseClient';
import './searchBar.css';

const SearchBar = ({currentStudy, setStudyData}) => {
    const [searchText, setSearchText] = useState("");

    // updates searchText everytime text in search bar changes
    const handleTextChange = (e) => {
        setSearchText(e.target.value);
    }

    useEffect(() => {
        const newStudyData = async () => {
            if (currentStudy !== "No Study Selected" && searchText !== "") {
                const d = await renderSearchResults(currentStudy, searchText);
                setStudyData(d);
            }
            else if (currentStudy !== "No Study Selected" && searchText === "") {
                const d = await renderStudyDatabase(currentStudy);
                setStudyData(d);
            }
        };

        newStudyData();
    }, [currentStudy, searchText, setStudyData]);

    // returns search bar text field
    return (
        <input type="text" id='participantSearch' value={searchText} onInput={handleTextChange} placeholder="Search ParticipantID..."></input>
    );
}

export default SearchBar;