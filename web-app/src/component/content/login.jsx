import React, { Component } from 'react';
import Base from './base';
import './login.css';
import '../../index.css';
import {checkAdminCredentials} from '../../supabaseClient.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';

class Login extends Component {
    state = {
        adminId: '',
        password: '',
        adminIdError: '',
        passwordError: '',
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, [`${e.target.name}Error`]: '' });
    };

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

function withHook(Component) {
    return function WrappedComponent(props) {
        const navigate = useNavigate();
        const auth = useAuth(); 
        return <Component {...props} navigate={navigate} auth={auth} />;
    };
}

export default withHook(Login);
