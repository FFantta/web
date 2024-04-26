import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

/**
 * A hook to access the authentication context.
 * @returns - the authentication context.
 */
export function useAuth() {
    return useContext(AuthContext);
}

/**
 * Manages aunthentication throughout the app by modifying adminID, and by passing admin ID and the login and logout process.
 * @param {props} children - the content to be wrapped in the authentication provider. 
 * @returns - the children wrapped in the authentication provider.
 */
export const AuthProvider = ({ children }) => {
    
    const [adminId, setAdminId] = useState(() => localStorage.getItem('adminId'));

    useEffect(() => {
        if (adminId) {
            localStorage.setItem('adminId', adminId); 
        } else {
            localStorage.removeItem('adminId'); 
        }
    }, [adminId]);

    const login = (id) => {
        setAdminId(id); 
    };

    const logout = () => {
        localStorage.removeItem('adminId');
        setAdminId(null); 
    };

    return (
        <AuthContext.Provider value={{ adminId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
