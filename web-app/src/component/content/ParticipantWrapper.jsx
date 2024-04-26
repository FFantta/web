import React from 'react';
import { useNavigate } from 'react-router-dom';
import Participant from './participant';

const ParticipantWrapper = () => {
  const navigate = useNavigate();
  return <Participant navigate={navigate} />;
};

export default ParticipantWrapper;
