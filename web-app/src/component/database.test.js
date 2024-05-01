import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Database from './database';
import { renderStudyDatabase } from '../supabaseClient';
import { setCurrentStudy } from './participantData';

jest.mock('../supabaseClient', () => ({
  renderStudyDatabase: jest.fn()
}));

jest.mock('./participantData', () => ({
  setCurrentStudy: jest.fn()
}));

describe('Database Component', () => {
    test('displays a message when no study is selected', () => {
        render(<Database currentStudy="No Study Selected" />);
        expect(screen.getByText("'Please select a study above.'")).toBeInTheDocument();
    });

    test('fetches study data and displays it when a study is selected', async () => {
        const mockStudyData = <div>Study Data</div>;
        renderStudyDatabase.mockResolvedValue(mockStudyData);

        render(<Database currentStudy="Study1" />);

        expect(setCurrentStudy).toHaveBeenCalledWith("Study1");
        await waitFor(() => {
            expect(renderStudyDatabase).toHaveBeenCalledWith("Study1");
            expect(screen.getByText("Study Data")).toBeInTheDocument();
        });
    });

    test('displays loading message while waiting for data', () => {
        renderStudyDatabase.mockResolvedValue(null); 
        render(<Database currentStudy="Study1" />);
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

});
