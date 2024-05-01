import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../ThemeContext';
import { AuthProvider } from './authContext';
import StudyHome from './studyhome'; 

jest.mock('./ScatterChart', () => () => 'ScatterChart');
jest.mock('./ScatterChart3D', () => () => 'ScatterChart3D');

jest.mock('../../supabaseClient', () => ({
  getStudyData: jest.fn(),
  renderDropdownStudies: jest.fn(() => Promise.resolve([
    <option key="1" value="Study 1">Study 1</option>,
    <option key="2" value="Study 2">Study 2</option>
  ])),
  renderStudyDatabase: jest.fn((studyID) => {
    if (studyID === 'No Study Selected') {
      return Promise.resolve(<h3>No study data found.</h3>);
    } else {
      return Promise.resolve(
        <table>
          <thead>
            <tr>
              <th>ParticipantID</th>
              <th>Xcoordinate</th>
              <th>Ycoordinate</th>
              <th>Timestamp</th>
              <th>Tag</th>
            </tr>
          </thead>
          <tbody>
            <tr key="1">
              <td>1</td>
              <td>10.00</td>
              <td>20.00</td>
              <td>2021-04-01T12:00:00Z</td>
              <td>Tag1</td>
            </tr>
          </tbody>
        </table>
      );
    }
  })
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    state: { selectedStudy: 'Study 1' }
  })
}));

global.alert = jest.fn();
global.URL.createObjectURL = jest.fn(() => "http://dummyurl.com");

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((message) => {
    if (message.includes("Not implemented: navigation")) {
      return;
    }
    console.error(message);
  });
});

afterAll(() => {
  console.error.mockRestore();
  global.URL.createObjectURL.mockRestore();
});

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
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('handles popups for visualising data correctly', async () => {
    const { getByText, queryByText } = renderWithProviders(<StudyHome />);
    const visualiseButton = getByText('2D Visualise Data');
    fireEvent.click(visualiseButton);
    await waitFor(() => {
      expect(queryByText('Close')).toBeInTheDocument();
    });

    const closeButton = getByText('Close');
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(queryByText('Close')).not.toBeInTheDocument();
    });
  });

  test('exports data when available', async () => {
    const mockData = [{ id: 1, name: 'Participant 1', data: 'Data 1' }];
    require('../../supabaseClient').getStudyData.mockResolvedValue(mockData);
    const { getByText } = renderWithProviders(<StudyHome />);
    const exportButton = getByText('Export Data');
    fireEvent.click(exportButton);
    await waitFor(() => {
      expect(global.URL.createObjectURL).toHaveBeenCalled();
    });
  });

  test('shows alert when no data available', async () => {
    require('../../supabaseClient').getStudyData.mockResolvedValue(null);
    const { getByText } = renderWithProviders(<StudyHome />);
    const exportButton = getByText('Export Data');
    fireEvent.click(exportButton);
    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith('No data available for the selected study.');
    });
  });
});
