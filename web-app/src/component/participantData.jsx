import React, { useEffect, useState, forwardRef } from 'react';
import { renderParticipantDatabase } from '../supabaseClient';
import { useImperativeHandle } from 'react';
import './participantData.css';

export let currentStudy = null;

export async function setCurrentStudy(num) {
    currentStudy = num;
}

export function getCurrentStudy() {
    return currentStudy;
}

// forwardRef passes a reference down to child (ParticipantData)
const ParticipantData = forwardRef(({ currentParticipant }, ref) => {
    const [participantData, setParticipantData] = useState(null);

    // runs function getParticipantData whenever currentParticipant changes
    useEffect(() => {
        const getParticipantData = async () => {
            const d = await renderParticipantDatabase(currentStudy, currentParticipant);
            setParticipantData(d);
        };

        if (currentParticipant !== null) {
            getParticipantData();
        }

    }, [currentParticipant]);


    // allows Parent (Participant) to trigger getParticipantData by calling getParticipantData through ref
    useImperativeHandle(ref, () => ({
        getParticipantData: async () => {
            const d = await renderParticipantDatabase(currentStudy, currentParticipant);
            setParticipantData(d);
        }
    }));


    // no buttons show up if error in getting participant number selected
    if (currentParticipant === null) {
        return (
            <div className='entryTableContainer'>
                <h3>'Error loading participant information, please try again.'</h3>
            </div>
        );
    }
    // entries populate the page if participant number successfully search
    else {
        return(
            <div className='entryTableContainer'>
                {participantData !== null ? participantData : <h3>Loading...</h3>}
            </div>  
        );
    }


});

export default ParticipantData;