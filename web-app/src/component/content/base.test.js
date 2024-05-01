import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import Base from './base';
import { ThemeProvider } from '../ThemeContext';

describe('Base Component', () => {
    test('renders with the correct themes and fonts from context', () => {
        const { container } = render(
            <ThemeProvider>
                <Base>
                    <div>Test Content</div>
                </Base>
            </ThemeProvider>
        );

        expect(container.firstChild).toHaveClass('card dark-theme medium-font');
    });

    test('displays children content correctly', () => {
        const { getByText } = render(
            <ThemeProvider>
                <Base>
                    <div>Test Content</div>
                </Base>
            </ThemeProvider>
        );

        expect(getByText('Test Content')).toBeInTheDocument();
    });
});
