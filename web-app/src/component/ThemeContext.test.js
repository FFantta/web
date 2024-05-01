import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

function TestComponent() {
    const { theme, toggleTheme, fontSize, changeFontSize } = useTheme();

    return (
        <div>
            <div data-testid="themeValue">{theme}</div>
            <button onClick={toggleTheme}>Toggle Theme</button>
            <div data-testid="fontSizeValue">{fontSize}</div>
            <button onClick={() => changeFontSize('small')}>Set Small Font</button>
            <button onClick={() => changeFontSize('medium')}>Set Medium Font</button>
            <button onClick={() => changeFontSize('large')}>Set Large Font</button>
        </div>
    );
}

describe('ThemeContext Component', () => {
    test('should toggle theme between light and dark', () => {
        const { getByTestId, getByText } = render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(getByTestId('themeValue').textContent).toBe('dark');

        act(() => {
            fireEvent.click(getByText('Toggle Theme'));
        });

        expect(getByTestId('themeValue').textContent).toBe('light');

        act(() => {
            fireEvent.click(getByText('Toggle Theme'));
        });

        expect(getByTestId('themeValue').textContent).toBe('dark');
    });

    test('should change font size correctly', () => {
        const { getByTestId, getByText } = render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(getByTestId('fontSizeValue').textContent).toBe('medium');

        act(() => {
            fireEvent.click(getByText('Set Small Font'));
        });

        expect(getByTestId('fontSizeValue').textContent).toBe('small');
        expect(document.documentElement.style.fontSize).toBe('12px');

        act(() => {
            fireEvent.click(getByText('Set Large Font'));
        });

        expect(getByTestId('fontSizeValue').textContent).toBe('large');
        expect(document.documentElement.style.fontSize).toBe('24px');

        act(() => {
            fireEvent.click(getByText('Set Medium Font'));
        });

        expect(getByTestId('fontSizeValue').textContent).toBe('medium');
        expect(document.documentElement.style.fontSize).toBe('16px');
    });

    test('should update class names on body and root element', () => {
        const { getByText } = render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        act(() => {
            fireEvent.click(getByText('Toggle Theme'));
        });

        expect(document.body.className).toBe('light-theme');

        act(() => {
            fireEvent.click(getByText('Set Small Font'));
        });

        expect(document.documentElement.className).toBe('small-font');
    });
});
