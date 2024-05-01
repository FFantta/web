import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import StudyDropdown from './studyDropdown';
import { renderDropdownStudies } from '../supabaseClient';

jest.mock('../supabaseClient', () => ({
  renderDropdownStudies: jest.fn(),
}));

describe('StudyDropdown Component', () => {
    const onSelectMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('displays "Loading..." initially', () => {
        renderDropdownStudies.mockResolvedValueOnce([]);
        render(<StudyDropdown onSelect={onSelectMock} selectedStudy="No Study Selected" />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('renders fetched study options when data is received', async () => {
        const studies = ['Study 1', 'Study 2', 'Study 3'];
        renderDropdownStudies.mockResolvedValueOnce(studies.map(study => <option key={study}>{study}</option>));

        await act(async () => {
            render(<StudyDropdown onSelect={onSelectMock} selectedStudy="No Study Selected" />);
        });

        await waitFor(() => {
            studies.forEach(study => {
            expect(screen.getByText(study)).toBeInTheDocument();
            });
        });
    });

    test('calls onSelect with the new study when selection changes', async () => {
        const studies = ['Study 1', 'Study 2', 'Study 3'];
        renderDropdownStudies.mockResolvedValueOnce(studies.map(study => <option key={study}>{study}</option>));

        await act(async () => {
            render(<StudyDropdown onSelect={onSelectMock} selectedStudy="No Study Selected" />);
        });

        const dropdown = screen.getByDisplayValue('No Study Selected');
        fireEvent.change(dropdown, { target: { value: 'Study 2' } });

        await waitFor(() => {
            expect(onSelectMock).toHaveBeenCalledWith('Study 2');
        });
    });

    test('displays "No Study Selected" as default if no selection is provided', () => {
        renderDropdownStudies.mockResolvedValueOnce([]);
        render(<StudyDropdown onSelect={onSelectMock} />);
        expect(screen.getByDisplayValue('No Study Selected')).toBeInTheDocument();
    });
});
