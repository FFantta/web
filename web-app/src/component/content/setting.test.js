import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../ThemeContext';
import { AuthProvider } from './authContext';
import Setting from './setting'; 

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

describe('Setting Component Tests', () => {
    test('renders Setting component with form', () => {
        const { getByText } = renderWithProviders(<Setting />);
        expect(getByText(/Appearance/i)).toBeInTheDocument();
        expect(getByText(/Change Password/i)).toBeInTheDocument();
    });

    test('allows input for new password and confirm new password', () => {
        const { getByPlaceholderText } = renderWithProviders(<Setting />);
        const newPasswordInput = getByPlaceholderText('Enter new password');
        const confirmPasswordInput = getByPlaceholderText('Comfirm new password');
        fireEvent.change(newPasswordInput, { target: { value: 'newPassword123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'newPassword123' } });
        expect(newPasswordInput.value).toBe('newPassword123');
        expect(confirmPasswordInput.value).toBe('newPassword123');
    });

    test('shows alert when passwords do not match on submit', () => {
        window.alert = jest.fn();
        const { getByPlaceholderText, getByText } = renderWithProviders(<Setting />);
        const newPasswordInput = getByPlaceholderText('Enter new password');
        const confirmPasswordInput = getByPlaceholderText('Comfirm new password');
        const submitButton = getByText('Submit');

        fireEvent.change(newPasswordInput, { target: { value: 'newPassword123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'differentPassword123' } });
        fireEvent.click(submitButton);

        expect(window.alert).toHaveBeenCalledWith('New passwords do not match.');
    });
});
