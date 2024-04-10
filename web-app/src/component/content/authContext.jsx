import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

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
        setAdminId(null); 
    };

    return (
        <AuthContext.Provider value={{ adminId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
