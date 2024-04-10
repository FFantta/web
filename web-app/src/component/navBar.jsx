import React from 'react';
import { Link } from 'react-router-dom';
import './navBar.css';
import { useAuth } from '../component/content/authContext'; 

const NavBar = () => {
    
    const { adminId } = useAuth(); 


    return (
        <nav className="navbar bg-body-tertiary">
            <div className="container">
                <img src="/logo.png" alt="Logo" className="logo-img" />

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
                    <ul className="navbar-nav ">
                        <li className="nav-item">
                            <Link className="navbar-brand" to="/studyHome">Home</Link>
                        </li>
                        <li className="nav-item"> 
                            <Link className="navbar-brand" to="/login">Log out</Link>
                        </li>
                        <li className="nav-item"> 
                            <Link className="navbar-brand" to="/register">Create</Link>
                        </li>
                        <li className="nav-item"> 
                            <Link className="navbar-brand" to="/setting">Settings</Link>
                        </li>
                        
                    </ul>
                </div>
                
            </div>
        </nav>

    );
};

export default NavBar;
