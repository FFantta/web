import React, { useEffect, useState } from 'react';
import { renderDropdownStudies } from '../supabaseClient';
import './studyDropdown.css';

const StudyDropdown = ({onSelect}) => {
  const [dropdownData, setDropdownData] = useState(null);

  useEffect(() => {
    const getDropdownData = async () => {
        const d = await renderDropdownStudies();
        setDropdownData(d);
    };

    getDropdownData();

  });
  
  const handleSelectionChange = (e) => {
    onSelect(e.target.value);
  }

  return (
    <select id='dropdown' onChange={handleSelectionChange}>
      <option value="No Study Selected">No Study Selected</option>
      {dropdownData !== null ? dropdownData : <option>Loading...</option>}
    </select>
  );
}

export default StudyDropdown;