import React from 'react';
import { useNavigate } from 'react-router-dom';
import Participant from './participant';

/**
 * Wraps a participant component so that the useNavigate() function can be passed to it and used within the component.
 * @returns - a wrapped Participant component with the useNavigate() function.
 */
const ParticipantWrapper = () => {
  const navigate = useNavigate();
  return <Participant navigate={navigate} />;
};

export default ParticipantWrapper;
