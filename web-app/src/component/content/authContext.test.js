import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from './authContext';

const TestComponent = () => {
  const { adminId, login, logout } = useAuth();

  return (
    <>
      <div data-testid="adminId">{adminId || 'No Admin'}</div>
      <button onClick={() => login('123')}>Log In</button>
      <button onClick={() => logout()}>Log Out</button>
    </>
  );
};

describe('AuthContext Component', () => {
    beforeEach(() => {
        jest.spyOn(window.localStorage.__proto__, 'setItem');
        jest.spyOn(window.localStorage.__proto__, 'getItem');
        jest.spyOn(window.localStorage.__proto__, 'removeItem');
        localStorage.clear(); 
    });

    afterEach(() => {
        localStorage.setItem.mockRestore();
        localStorage.getItem.mockRestore();
        localStorage.removeItem.mockRestore();
    });

    test('initializes adminId from localStorage', () => {
        localStorage.getItem.mockReturnValue('initialId');
        const { getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        expect(getByTestId('adminId').textContent).toBe('initialId');
    });

    test('handles login correctly', () => {
        const { getByText, getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        act(() => {
            fireEvent.click(getByText('Log In'));
        });
        expect(getByTestId('adminId').textContent).toBe('123');
        expect(localStorage.setItem).toHaveBeenCalledWith('adminId', '123');
    });

    test('handles logout correctly', () => {
        const { getByText, getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        act(() => {
            fireEvent.click(getByText('Log In'));
        });
        act(() => {
            fireEvent.click(getByText('Log Out'));
        });
        expect(getByTestId('adminId').textContent).toBe('No Admin');
        expect(localStorage.removeItem).toHaveBeenCalledWith('adminId');
    });
});
