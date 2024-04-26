import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Base from './base';
import StudyDropdown from '../studyDropdown';
import Database from '../database';
import { getStudyData } from '../../supabaseClient';
import './studyhome.css';
import '../../index.css';
import ScatterChart from './ScatterChart'; 
import ScatterChart3D from './ScatterChart3D';


/**
 * The study home component is the study home page which the user sees once they log in. It allows the user to select a study and see all its data.
 * It also has a navigation bar so the user can navigate to other pages. You can visualise and export data from this page too.
 */
const StudyHome = () => {
    const location = useLocation();
    const initialStudy = location.state?.selectedStudy || 'No Study Selected';

    const [currentStudy, setCurrentStudy] = useState(initialStudy);
    const [showPopup, setShowPopup] = useState(false);
    const [show3DPopup, setShow3DPopup] = useState(false);

    useEffect(() => {
        setCurrentStudy(initialStudy); // Update state when location state changes
    }, [initialStudy]);

    /**
     * Shows a 2D visualisation of the data in a pop up window.
     */
    const handleVisualise = () => {
        setShowPopup(true);
    };

    /**
     * Shows a 3D visualisation of the data in a pop up window.
     */
    const handleVisualise3d = () => {
        setShow3DPopup(true);
    };

    /**
     * Exports the data of the currently selected study to the user's device as a CSV file.
     */
    const handleExport = async () => {
        if (currentStudy === null || currentStudy === '') {
            alert('You must select a study.');
        } else {
            const data = await getStudyData(currentStudy);
            if(data && data.length > 0){
                const header = Object.keys(data[0]).join(',');
                const rows = data.map(row => Object.values(row).join(','));
                const csv = `${header}\n${rows.join('\n')}`;
                const blob = new Blob([csv], { type: 'text/csv' });
                const a = document.createElement('a');
                const filename = `${currentStudy}_data.csv`;
                a.href = window.URL.createObjectURL(blob);
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                alert('No data available for the selected study.');
            }
        }   
    };

    return (
        <Base>
            <div className='mainContainerStudy'>
                <div className='titleContainerStudy'>Study Home</div>
                <br></br>
                <StudyDropdown selectedStudy={currentStudy} onSelect={setCurrentStudy} />
                <br></br>
                <div className='tableAndButtons'>
                    <Database currentStudy={currentStudy} />
                    <div className='home-buttons'>
                        <button onClick={handleVisualise}>Visualise Data</button>
                        {showPopup && (
                            <div className="popup">
                                <ScatterChart currentStudy={currentStudy} />
                                <button onClick={() => setShowPopup(false)}>
                                    Close
                                </button>
                            </div>
                        )}
                        <button onClick={handleVisualise3d}>3D Visualise Data</button>
                        {show3DPopup && (
                            <div className="popup">
                                <ScatterChart3D currentStudy={currentStudy} />
                                <button onClick={() => setShow3DPopup(false)}>
                                    Close
                                </button>
                            </div>
                        )}
                        <button onClick={handleExport}>Export Data</button>
                    </div>
                </div>
            </div>
        </Base>
    );
}

export default StudyHome;
