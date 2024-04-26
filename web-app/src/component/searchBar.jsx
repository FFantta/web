import React, { useEffect, useState } from 'react';
import { renderSearchResults, renderStudyDatabase } from '../supabaseClient';
import './searchBar.css';

/**
 * A search bar component where different data entries are shown depending on the search text. 
 * @param {string} currentStudy
 * @param {Function} setSearchText
 * @returns - the search bar component.
 */
const SearchBar = ({currentStudy, setStudyData}) => {
    const [searchText, setSearchText] = useState("");

    /**
     * Updates searchText whenever the text in the search bar chnages.
     * @param {Event} e - the event object.
     */
    const handleTextChange = (e) => {
        setSearchText(e.target.value);
    }

    useEffect(() => {
        /**
         * Updates the study data results shown when the text in the search bar changes. Shows all results if no text is in the search bar.
         */
        const newStudyData = async () => {
            // fetches new data when search bar text changes
            if (currentStudy !== "No Study Selected" && searchText !== "") {
                const d = await renderSearchResults(currentStudy, searchText);
                setStudyData(d);
            }
            // displays usual data if there is nothingin the search bar
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