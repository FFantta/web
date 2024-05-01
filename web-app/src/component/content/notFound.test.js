import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotFound from './notFound';
import { ThemeProvider } from '../ThemeContext';

describe('NotFound Component', () => {
    test('displays the Not Found message', () => {
        const { getByText } = render(
            <ThemeProvider>
                <NotFound />
            </ThemeProvider>
        );

        expect(getByText('Not Found')).toBeInTheDocument();
    });

    test('renders within a Base component', () => {
        const { container } = render(
            <ThemeProvider>
                <NotFound />
            </ThemeProvider>
        );

        expect(container.firstChild).toHaveClass('card');
    });
});
