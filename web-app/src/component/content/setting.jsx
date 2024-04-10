import React, { useState } from 'react';
import Base from './base';
import './setting.css';
import { useTheme } from '../ThemeContext';

const Setting = () => {
    const { theme, toggleTheme, fontSize, changeFontSize } = useTheme();
    const [adminId, setAdminId] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }
        setError('');
    };

    return (
        <Base>
        <div className="settings-container">
            <div className="apperance-form">
                <h2>Apperance</h2>
                <div className="theme-selector">
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
            </div>
            </div>
            <div className="password-change-form">
                <h2>Change Password</h2>
                <form onSubmit={handlePasswordChange}>
                    <label>
                        Admin ID:
                        <input type="text" value={adminId} onChange={e => setAdminId(e.target.value)} />
                    </label>
                    <label>
                        Old Password:
                        <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
                    </label>
                    <label>
                        New Password:
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    </label>
                    <label>
                        Confirm New Password:
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </label>
                    <button type="submit" className="setting-submit-btn">Submit</button>
                    {error && <div className="error-message">{error}</div>}
                </form>
            </div>
            </div>
        </Base>
    );
};

export default Setting;
