import React, { useEffect, useState } from 'react';
import { renderDropdownStudies } from '../supabaseClient';
import './studyDropdown.css';

/**
 * A dropdown menu component that allows the user to select studies.
 * @param {Function} onSelect -  a function which handles study selection.
 * @returns - a study dropdown menu containing all the studies in the database.
 */
const StudyDropdown = ({ onSelect, selectedStudy }) => {
  const [dropdownData, setDropdownData] = useState(null);

  useEffect(() => {
    /**
     * Fetches all the available studies in the database and sets it in the dropdownData variable so it can be displayed in the dropdown menu.
     */
    const getDropdownData = async () => {
      const d = await renderDropdownStudies();
      setDropdownData(d);
    };

    getDropdownData();
  }, []); 

  /**
   * Handles the event of a selection change in the dropdown menu.
   * @param {Event} e - the event object
   */
  const handleSelectionChange = (e) => {
    onSelect(e.target.value);
  };

  return (
    <select id='dropdown' value={selectedStudy} onChange={handleSelectionChange}>
      <option value="No Study Selected">No Study Selected</option>
      {dropdownData ? dropdownData : <option>Loading...</option>}
    </select>
  );
};


export default StudyDropdown;