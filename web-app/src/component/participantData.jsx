import React, { useEffect, useState, forwardRef } from 'react';
import { renderParticipantDatabase } from '../supabaseClient';
import { useImperativeHandle } from 'react';
import './participantData.css';

export let currentStudy = null;

/**
 * Sets the name of the current study (which changes throughout the use of the program) to ensure the correct data is fetched.
 * @param {string} name 
 */
export async function setCurrentStudy(name) {
    currentStudy = name;
}

/**
 * A getter for the current selected study.
 * @returns the name of the study that is currently selected.
 */
export function getCurrentStudy() {
    return currentStudy;
}

// forwardRef passes a reference down to child (ParticipantData)

/**
 * A participant data component which shows all the data in the database for a given participant in a given study.
 * @param {number} currentParticipant - the ID of the current participant.
 * @param {Ref} ref - a forwarded reference that can be passed down to a child, the child being ParticipantData.
 * @returns - the data entries for a given participant in a given study.
 */
const ParticipantData = forwardRef(({ currentParticipant }, ref) => {
    const [participantData, setParticipantData] = useState(null);

    // runs function getParticipantData whenever currentParticipant changes
    useEffect(() => {
        /**
         * Fetches participant data from the database and sets it in the participantData variable.
         */
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