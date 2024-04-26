import React, { Component } from 'react';
import Base from './base';
import './register.css';
import '../../index.css';
import { checkForAdminRole, insertAdmin, insertStudy } from "../../supabaseClient";
import { useAuth } from './authContext';
import './setting.css';

/**
 * The register component shows the register or create page which allows users to create a new admin (if they have the clearance to) or to create a new study.
 */
class Register extends Component {
    state = {
        defaultPassword: '',
        selectedRole: '',
        studyName: '',
        roles: ['Admin', 'Moderator', 'User'],
    };

    /**
     * Handles changes to the default password text field and keeps the defaultPassword variable updated.
     * @param {Event}} e - the event object. 
     */
    handleDefaultPasswordChange = (e) => {
        this.setState({ defaultPassword: e.target.value });
    };

    /**
     * Handles changes to the selected role and keeps the selectedRole variable updated.
     * @param {Event} e - the event object.
     */
    handleRoleChange = (e) => {
        this.setState({ selectedRole: e.target.value });
    };

    /**
     * Handles changes to the study name text fields and keeps the studyName variable updated.
     * @param {Event} e - the event object.
     */
    handleStudyNameChange = (e) => {
        this.setState({ studyName: e.target.value });
    };

    /**
     * Handles the creation of a new study and inserts it into the database.
     * @returns - a success message if the new study has been added to the database, and an error message if not.
     */
    handleCreateStudy = async () => {
        const { studyName } = this.state;

        if (studyName.trim() === '') {
            alert('Please enter a study name');
            return;
        }

        try {
            const insertionResult = await insertStudy(studyName);
            if (insertionResult) {
                alert("Study created successfully: " + studyName);
                this.setState({ studyName: '' });
  
            } else {
                alert('Failed to create study.');
            }
        } catch (error) {
            console.error("Error creating study: ", error);
            alert('Error creating study.');
        }
    };

    /**
     * Handles the insertion of a new admin into the database. It error checks all input and ensures the user has the clearance to make new admins.
     * @param {Event} e - the event object.
     * @returns - a success message and the new admin's ID if the new admin has been added to the database, and an error message if not.
     */
    handleSubmit = async (e) => {
        e.preventDefault();

        const { adminId } = this.props.adminId;

        if (this.state.defaultPassword.trim() === '' || this.state.selectedRole.trim() === '') {
            alert('Please provide the default password and/or select a role.');
            return;
        }
        const { defaultPassword, selectedRole } = this.state;

        try {
            const correctRole = await checkForAdminRole(adminId);
            if (correctRole) {
                const newAdminID = await insertAdmin(defaultPassword, selectedRole);
                if (newAdminID) {
                    // If admin is inserted successfully, set the newAdminID in the state
                    alert('Admin successfully created! New Admin ID: ' + newAdminID);
                } else {
                    alert('Failed to create new admin. Please try again.');
                }
            } else {
                alert('You are not authorised to create new admins.');
            }
        } catch (error) {
            console.error("Error during admin creation:", error);
            alert('Error during admin creation');
        }
    };

    render() {
        const { defaultPassword, selectedRole, studyName, roles } = this.state;
        return (
            <Base>
                <div className="settings-container">
                    <div className="form-section"> 
                        <h2>Create new admin</h2>
                        <div> 
                            <label htmlFor="defaultPassword">Default Password:</label>
                            <input
                                type="password"
                                id="defaultPassword"
                                value={defaultPassword}
                                onChange={this.handleDefaultPasswordChange}
                                placeholder="Enter default password"
                            />
                            <label htmlFor="selectedRole">Role:</label>
                            <select
                                id="selectedRole"
                                value={selectedRole}
                                onChange={this.handleRoleChange}
                            >
                                <option value="">Select role of new admin</option>
                                {roles.map((role, index) => (
                                    <option key={index} value={role}>{role}</option>
                                ))}
                            </select>
                            <button className="setting-submit-btn" onClick={this.handleSubmit}>Create</button>
                        </div>
                    </div>
                    <div className="form-section"> {/* 移除 apperance-form 类 */}
                        <h2>Create new study</h2>
                        <div> {/* 移除 theme-selector 类 */}
                            <label htmlFor="studyName">Study Name:</label>
                            <input
                                type="text"
                                id="studyName"
                                value={studyName}
                                onChange={this.handleStudyNameChange}
                                placeholder="Enter study name"
                            />
                            <button className="setting-submit-btn" onClick={this.handleCreateStudy}>Create Study</button>
                        </div>
                    </div>
                </div>
            </Base>
        );
    }
}

/**
 * A function which wraps a component, allowing the adminId data to be included when it is exported/used.
 * @param {Component} Component - the target component to be exported with hooks.
 * @returns - the wrapped component with the adminId varibales.
 */
function withHook(Component) {
    return function WrappedComponent(props) {
        const adminId = useAuth(); 
        return <Component {...props} adminId={adminId}/>;
    };
}

export default withHook(Register);