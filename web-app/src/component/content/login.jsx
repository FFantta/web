import React, { Component } from 'react';
import Base from './base';
import './login.css';
import '../../index.css';
import {checkAdminCredentials} from '../../supabaseClient.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';

/**
 * This component acts as the login page which the user sees when they initially land on the website.
 */
class Login extends Component {
    state = {
        adminId: '',
        password: '',
        adminIdError: '',
        passwordError: '',
    };

    /**
     * Handles changes in the text fields and keep the associted variables updated.
     * @param {Event} e - an event object
     */
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, [`${e.target.name}Error`]: '' });
    };

    /**
     * Allows the user to log in to the webiste when valid credentials are entered.
     * @param {Event} e - an event object.
     * @returns - and error message if there is an issue with the input, otherwise it takes the user to the study home page.
     */
    handleSubmit = async (e) => {
        e.preventDefault();

        if (this.state.adminId.trim() === 0 || this.state.password.trim() === '') {
            alert('Please provide both admin ID and password');
            return;
        }
        const { adminId, password } = this.state;

        try {
            const loginSuccessful = await checkAdminCredentials(adminId, password);
            if (loginSuccessful) {
                // Open next page logic
                this.props.auth.login(adminId);
                this.props.navigate("/studyHome");
            } else {
                // Display error message
                console.log("Login failed!");
            }
        } catch (error) {
            // Errors that occurred
            console.error("Error during login:", error);
        }
    };

    render() {
        const { adminId, password, adminIdError, passwordError } = this.state;
        return (
            <Base>
                <div className="mainContainer">
                    <div className="titleContainer">Login</div>
                    <div className="inputContainer">
                        <input
                            type="text"
                            id="adminId"
                            name="adminId"
                            value={adminId}
                            onChange={this.handleChange}
                            placeholder="Admin ID"
                            className="inputBox"
                        />
                        {adminIdError && <div className="errorLabel">{adminIdError}</div>}
                    </div>
                    <div className="inputContainer">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={this.handleChange}
                            placeholder="Password"
                            className="inputBox"
                        />
                        {passwordError && <div className="errorLabel">{passwordError}</div>}
                    </div>
                    <div className="buttonContainer">
                        <button type="submit" className="login-submit-btn" onClick={this.handleSubmit}>Login</button>
                    </div>
                </div>
            </Base>
        );
    }
}

/**
 * A function which wraps a component, allowing the navigate and auth variables to be included when it is exported/used.
 * @param {Component} Component - the target component to be exported with hooks.
 * @returns - the wrapped component with the navigate and auth varibales.
 */
function withHook(Component) {
    return function WrappedComponent(props) {
        const navigate = useNavigate();
        const auth = useAuth(); 
        return <Component {...props} navigate={navigate} auth={auth} />;
    };
}

export default withHook(Login);
