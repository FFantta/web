import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from './searchBar';
import { renderSearchResults, renderStudyDatabase } from '../supabaseClient';

jest.mock('../supabaseClient', () => ({
    renderSearchResults: jest.fn(),
    renderStudyDatabase: jest.fn(),
}));

describe('SearchBar Component', () => {
    const setStudyDataMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the search input field', () => {
        render(<SearchBar currentStudy="Study1" setStudyData={setStudyDataMock} />);
        expect(screen.getByPlaceholderText('Search ParticipantID...')).toBeInTheDocument();
    });

    test('calls renderSearchResults when input has text and a valid study is selected', async () => {
        const searchText = 'John Doe';
        renderSearchResults.mockResolvedValueOnce([]);
        render(<SearchBar currentStudy="Study1" setStudyData={setStudyDataMock} />);
        const input = screen.getByPlaceholderText('Search ParticipantID...');
        fireEvent.input(input, { target: { value: searchText } });
        expect(renderSearchResults).toHaveBeenCalledWith('Study1', searchText);
    });

    test('calls renderStudyDatabase when input is empty and a valid study is selected', async () => {
        renderStudyDatabase.mockResolvedValueOnce([]);
        render(<SearchBar currentStudy="Study1" setStudyData={setStudyDataMock} />);
        const input = screen.getByPlaceholderText('Search ParticipantID...');
        fireEvent.input(input, { target: { value: '' } });
        expect(renderStudyDatabase).toHaveBeenCalledWith('Study1');
    });

    test('does not call any data fetch function when no study is selected', async () => {
        render(<SearchBar currentStudy="No Study Selected" setStudyData={setStudyDataMock} />);
        const input = screen.getByPlaceholderText('Search ParticipantID...');
        fireEvent.input(input, { target: { value: 'John' } });
        expect(renderSearchResults).not.toHaveBeenCalled();
        expect(renderStudyDatabase).not.toHaveBeenCalled();
    });
});
