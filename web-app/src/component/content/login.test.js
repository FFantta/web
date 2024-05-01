import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../ThemeContext';
import { AuthProvider } from './authContext';
import Login from './login';

jest.mock('../../supabaseClient', () => ({
    checkAdminCredentials: jest.fn()
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), 
    useNavigate: () => jest.fn().mockImplementation(() => () => {})
}));

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

describe('Login Component', () => {
  test('renders the login component properly', () => {
      const { getByRole, getByPlaceholderText } = renderWithProviders(<Login />);
      const loginButton = getByRole('button', { name: 'Login' }); 
      expect(loginButton).toBeInTheDocument();
      expect(getByPlaceholderText('Admin ID')).toBeInTheDocument();
      expect(getByPlaceholderText('Password')).toBeInTheDocument();
  });

  test('allows the user to enter credentials', () => {
      const { getByPlaceholderText } = renderWithProviders(<Login />);
      const adminIdInput = getByPlaceholderText('Admin ID');
      const passwordInput = getByPlaceholderText('Password');

      fireEvent.change(adminIdInput, { target: { value: '1' } });
      fireEvent.change(passwordInput, { target: { value: 'PaSsWoRd' } });

      expect(adminIdInput.value).toBe('1');
      expect(passwordInput.value).toBe('PaSsWoRd');
  });
});
