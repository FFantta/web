import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import StudyHome from './studyhome';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../ThemeContext';
import { AuthProvider } from './authContext';

// Mock necessary imports
jest.mock('react-plotly.js', () => () => <div>Mocked Plot</div>); // Mock Plotly
jest.mock('../../supabaseClient', () => ({
  getStudyData: jest.fn().mockResolvedValue([
    { id: 1, data: 'Sample data 1' },
    { id: 2, data: 'Sample data 2' }
  ])
}));

// Mock URL.createObjectURL and URL.revokeObjectURL
Object.defineProperty(window.URL, 'createObjectURL', { value: jest.fn(() => 'http://localhost/mockUrl') });
Object.defineProperty(window.URL, 'revokeObjectURL', { value: jest.fn() });

const renderWithProviders = (component) => {
    return render(
      <React.StrictMode>
        <AuthProvider>
          <ThemeProvider> 
            <BrowserRouter>
              {component}
            </BrowserRouter>
          </ThemeProvider>
        </AuthProvider>
      </React.StrictMode>
    );
  };

describe('StudyHome Component', () => {
  test('renders StudyHome component with initial state', () => {
    const { getByText } = renderWithProviders(<StudyHome />);
    expect(getByText('Study Home')).toBeInTheDocument();
  });

//   test('handles data visualization popup', () => {
//     const { getByText, queryByText } = renderWithProviders(<StudyHome />);
//     fireEvent.click(getByText('Visualise Data'));
//     expect(queryByText('Close')).toBeInTheDocument(); // Check if the popup with Close button is shown
//   });

  test('handles data export successfully', async () => {
    const { getByText } = renderWithProviders(<StudyHome />);
    fireEvent.click(getByText('Export Data'));

    await waitFor(() => {
      expect(global.URL.createObjectURL).toHaveBeenCalled();
    });
  });
});
