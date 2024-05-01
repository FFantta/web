import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ParticipantWrapper from './ParticipantWrapper';
import Participant from './participant';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

jest.mock('./Participant', () => jest.fn(() => null));

describe('ParticipantWrapper Component', () => {
  test('passes a navigate function to Participant', () => {
    const mockNavigate = jest.fn();
    require('react-router-dom').useNavigate.mockImplementation(() => mockNavigate);

    render(
      <BrowserRouter>
        <ParticipantWrapper />
      </BrowserRouter>
    );

    expect(Participant).toHaveBeenCalledWith({ navigate: mockNavigate }, {});
  });
});
