import React, { useState } from 'react';
import Base from './base';
import './setting.css';
import { changePassword } from '../../supabaseClient';
import { useTheme } from '../ThemeContext';
import { useAuth } from './authContext';

/**
 * The settings component shows the settings page which allows the user to customise their experience.
 * For exmaple, they can change to light/dark mode and change their password here.
 * @returns - the settings page component.
 */
const Setting = () => {
    const { theme, toggleTheme, fontSize, changeFontSize } = useTheme();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { adminId } = useAuth();

    /**
     * This facilitates the backend processes involved in changing the current user's password.
     * @param {Event} e - the event object.
     * @returns - error messages if there is a problem with the inout, or a success message when the password is changed.
     */
    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (newPassword === "" || confirmPassword === "") {
            alert("Please ensure all fields are filled.");
        }
        else if (newPassword !== confirmPassword) {
            alert('New passwords do not match.');
        }
        else {
            changePassword(adminId, newPassword);
        }
    };

    return (
        <Base>
        <div className="settings-container">
            <div className="form-section">
                <h2>Apperance</h2>
                {/* <div className="theme-selector"> */}
                <label htmlFor="theme-select">Choose a theme: </label>
                <select id="theme-select" value={theme} onChange={(e) => toggleTheme(e.target.value)}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>

                <label htmlFor="font-size-select">Font Size: </label>
                <select id="font-size-select" value={fontSize} onChange={(e) => changeFontSize(e.target.value)}>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                </select>
            {/* </div> */}
            </div>
            <div className="form-section">
                <h2>Change Password</h2>
                <form onSubmit={handlePasswordChange}>
                    <label>
                        New Password:
                        <input type="password" placeholder="Enter new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    </label>
                    <label>
                        Confirm New Password:
                        <input type="password" placeholder="Comfirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </label>
                    <button type="submit" className="setting-submit-btn">Submit</button>
                </form>
            </div>
            </div>
        </Base>
    );
};

export default Setting;
