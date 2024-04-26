import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

/**
 * This is used to manage the colour scheme and font size throughout the website.
 * @param {props} children - the content to be wrapped in the theme provider. 
 * @returns - the children wrapped in the theme provider.
 */
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');
    const [fontSize, setFontSize] = useState('medium'); 

    /**
     * This switches between light mode and dark mode depending on the current theme.
     */
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    /**
     * This changes the font size throughout the program
     * @param {number} size - the desired font size.
     */
    const changeFontSize = (size) => {
        setFontSize(size);
    };

    useEffect(() => {
        document.body.className = `${theme}-theme`;
    }, [theme]);

    useEffect(() => {
        const root = document.documentElement; 
        root.className = `${fontSize}-font`;
        root.style.fontSize = fontSize === 'small' ? '12px' : fontSize === 'medium' ? '16px' : '24px'; 
    }, [fontSize]);
    

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, fontSize, changeFontSize }}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * A hook to access the theme context.
 * @returns - the theme context.
 */
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;