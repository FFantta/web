import React from 'react';
import { render, fireEvent } from '@testing-library/react'; 
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './authContext';
import Register from './register';
import { ThemeProvider } from '../ThemeContext';


const renderWithProviders = (component) => {
    return render(
      <AuthProvider>
        <ThemeProvider> 
          <BrowserRouter>
            {component}
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    );
};


describe('Register Component Tests', () => {
    test('renders Register component with form', () => {
        const { getByText, getByPlaceholderText } = renderWithProviders(<Register />);
        expect(getByText('Create new admin')).toBeInTheDocument();
        expect(getByPlaceholderText('Enter default password')).toBeInTheDocument();
        expect(getByText('Create Study')).toBeInTheDocument();
        expect(getByPlaceholderText('Enter study name')).toBeInTheDocument();
    });

    test('handles input changes for default password and study name', () => {
        const { getByPlaceholderText } = renderWithProviders(<Register />);
        const defaultPasswordInput = getByPlaceholderText('Enter default password');
        const studyNameInput = getByPlaceholderText('Enter study name');

        fireEvent.change(defaultPasswordInput, { target: { value: 'newpassword123' } });
        fireEvent.change(studyNameInput, { target: { value: 'New Study' } });

        expect(defaultPasswordInput.value).toBe('newpassword123');
        expect(studyNameInput.value).toBe('New Study');
    });
});
