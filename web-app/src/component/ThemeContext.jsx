import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(' ');
    const [fontSize, setFontSize] = useState('medium'); 

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

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

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
