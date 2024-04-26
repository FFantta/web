import React from 'react';
import { Link } from 'react-router-dom';
import './navBar.css';
import { useAuth } from '../component/content/authContext'; 
import { useNavigate, NavLink } from 'react-router-dom';

/**
 * A navigation bar component which allows logged in users to navigate to different pages within the webiste.
 * @returns - the navigation bar component.
 */
const NavBar = () => {
    
    const navigate = useNavigate();
    const { adminId, logout } = useAuth();

    /**
     * Allows the user to logout by navigating back to the login screen.
     */
    const handleLogout = () => {
        logout();
        navigate('/login'); 
    };

    return (
        <nav className="navbar bg-body-tertiary">
            <div className="container">
                <Link to="/studyHome">
                    <img src="/logo.png" alt="Logo" className="logo-img"/>
                </Link>

                {adminId && (
                    <div className="navbar-center mx-auto">
                        <span className="navbar-text">
                            Admin ID: {adminId}
                        </span>
                    </div>
                )}

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <NavLink
                        to="/studyHome"
                        className={({ isActive }) => (isActive ? 'navbar-brand active' : 'navbar-brand')}
                        >
                        Studyhome
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                        to="/register"
                        className={({ isActive }) => (isActive ? 'navbar-brand active' : 'navbar-brand')}
                        >
                        Creatings
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                        to="/setting"
                        className={({ isActive }) => (isActive ? 'navbar-brand active' : 'navbar-brand')}
                        >
                        Settings
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                        onClick={handleLogout}
                        to="/login"
                        className={({ isActive }) => (isActive ? 'navbar-brand active' : 'navbar-brand')}
                        >
                        Logout
                        </NavLink>
                    </li>
                </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
