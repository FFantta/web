import React, { Component } from 'react';
import Base from './base';
import '../../index.css';
//import './login.css';
import './login.css';
// import './register.css';
import { checkForAdminRole, insertAdmin,insertStudy } from "../../supabaseClient";

class Register extends Component {
    state = {
        adminId: '',
        defaultPassword: '',
        selectedRole: '',
        studyName: '',
        roles: ['Admin', 'Moderator', 'User'],
        showConfirmation: false
    };

    handleAdminIdChange = (e) => {
        this.setState({ adminId: e.target.value });
    };

    handleDefaultPasswordChange = (e) => {
        this.setState({ defaultPassword: e.target.value });
    };

    handleRoleChange = (e) => {
        this.setState({ selectedRole: e.target.value });
    };

    handleStudyNameChange = (e) => {
        this.setState({ studyName: e.target.value });
    };

    handleCreateStudy = async () => {
        const { studyName } = this.state;

        if (studyName.trim() === '') {
            alert('Please enter a study name');
            return;
        }

        try {
            const insertionResult = await insertStudy(studyName);
            if (insertionResult) {
                console.log("Study created successfully:", studyName);
                this.setState({ studyName: '' });
  
            } else {
                alert('Failed to create study');
            }
        } catch (error) {
            console.error("Error creating study:", error);
            alert('Error creating study');
        }
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        if (this.state.adminId.trim() === '' || this.state.defaultPassword.trim() === '' || this.state.selectedRole.trim() === '') {
            alert('Please provide your admin ID, default password, and select a role');
            return;
        }
        const { adminId, defaultPassword, selectedRole } = this.state;

        try {
            const correctRole = await checkForAdminRole(adminId);
            if (correctRole) {
                const newAdminID = await insertAdmin(defaultPassword, selectedRole);
                if (newAdminID) {
                    // If admin is inserted successfully, set the newAdminID in the state
                    this.setState({ newAdminID, showConfirmation: true });
                } else {
                    alert('Failed to insert admin');
                }
            } else {
                console.log("Admin role incorrect");
            }
        } catch (error) {
            console.error("Error during admin creation:", error);
            alert('Error during admin creation');
        }
    };

    render() {
        const { adminId, newAdminID, defaultPassword, selectedRole, studyName, roles, showConfirmation } = this.state;
        return (
            <Base>
                <div className="mainContainer">
                    <div className="registerContainer">
                        <div className="container">
                            <div className="titleContainer">Create new admin</div>
                            <div className="inputContainer">
                                <input
                                    type="text"
                                    id="adminId"
                                    name="adminId"
                                    value={adminId}
                                    onChange={this.handleAdminIdChange}
                                    placeholder="Enter your Admin ID"
                                    className="inputBox"
                                />
                            </div>
                            <div className="inputContainer">
                                <input
                                    type="password"
                                    id="defaultPassword"
                                    name="defaultPassword"
                                    value={defaultPassword}
                                    onChange={this.handleDefaultPasswordChange}
                                    placeholder="Enter default password"
                                    className="inputBox"
                                />
                            </div>
                            <div className="inputContainer">
                                <select
                                    id="selectedRole"
                                    name="selectedRole"
                                    value={selectedRole}
                                    onChange={this.handleRoleChange}
                                    className="inputBox"
                                >
                                    <option value="">Select role of new admin</option>
                                    {roles.map((role, index) => (
                                        <option key={index} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="buttonContainer">
                                <button type="submit" onClick={this.handleSubmit}>Create</button>
                            </div>
                            {showConfirmation && (
                                <div className="confirmationMessage">Created admin ID: {newAdminID} </div>
                            )}
                        </div>
                        <div className="container">
                            <div className="titleContainer">Create new study</div>
                            <div className="inputContainer">
                                <input
                                    type="text"
                                    id="studyName"
                                    name="studyName"
                                    value={studyName}
                                    onChange={this.handleStudyNameChange}
                                    placeholder="Enter study name"
                                    className="inputBox"
                                />
                            </div>
                            <div className="buttonContainer">
                                <button type="button" onClick={this.handleCreateStudy}>Create Study</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Base>
        );
    }

}

export default Register;


