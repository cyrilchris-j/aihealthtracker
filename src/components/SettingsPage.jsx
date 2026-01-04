import React, { useState } from 'react';
import { useHabit } from '../context/HabitContext';
import {
    requestNotificationPermission,
    getNotificationPermission,
    showTestNotification
} from '../utils/notifications';

const SettingsPage = () => {
    const { settings, updateSettings, userProfile, updateUserProfile, exportData, importData, resetAllData } = useHabit();
    const [showProfileEdit, setShowProfileEdit] = useState(false);
    const [profileData, setProfileData] = useState(userProfile || {});
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const handleThemeToggle = () => {
        updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
    };

    const handleNotificationToggle = async () => {
        if (!settings.notifications) {
            const permission = await requestNotificationPermission();
            if (permission === 'granted') {
                updateSettings({ notifications: true });
                showTestNotification();
            }
        } else {
            updateSettings({ notifications: false });
        }
    };

    const handleExport = () => {
        const data = exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    const success = importData(data);
                    if (success) {
                        alert('Data imported successfully!');
                        window.location.reload();
                    } else {
                        alert('Failed to import data. Please check the file format.');
                    }
                } catch (error) {
                    alert('Invalid file format.');
                }
            };
            reader.readAsText(file);
        }
    };

    const handleReset = () => {
        const success = resetAllData();
        if (success) {
            setShowResetConfirm(false);
            window.location.reload();
        }
    };

    const handleProfileUpdate = () => {
        updateUserProfile(profileData);
        setShowProfileEdit(false);
    };

    const notificationPermission = getNotificationPermission();

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            <h1 className="mb-lg">Settings ⚙️</h1>

            {/* Profile Settings */}
            <div className="card mb-lg">
                <h3 className="mb-md">👤 Profile</h3>
                <div style={styles.settingRow}>
                    <div>
                        <div className="font-semibold">Name</div>
                        <div className="text-sm text-secondary">{userProfile?.name || 'Not set'}</div>
                    </div>
                    <button onClick={() => {
                        setProfileData(userProfile || {});
                        setShowProfileEdit(true);
                    }} className="btn btn-secondary btn-sm">
                        Edit Profile
                    </button>
                </div>
                <div style={styles.settingRow}>
                    <div>
                        <div className="font-semibold">Routine Preference</div>
                        <div className="text-sm text-secondary">{userProfile?.routine || 'Flexible'}</div>
                    </div>
                </div>
                <div style={styles.settingRow}>
                    <div>
                        <div className="font-semibold">Focus Goal</div>
                        <div className="text-sm text-secondary">{userProfile?.focus || 'Productivity'}</div>
                    </div>
                </div>
            </div>

            {/* Appearance */}
            <div className="card mb-lg">
                <h3 className="mb-md">🎨 Appearance</h3>
                <div style={styles.settingRow}>
                    <div>
                        <div className="font-semibold">Theme</div>
                        <div className="text-sm text-secondary">
                            {settings.theme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
                        </div>
                    </div>
                    <button onClick={handleThemeToggle} className="btn btn-primary btn-sm">
                        Switch to {settings.theme === 'dark' ? 'Light' : 'Dark'}
                    </button>
                </div>
            </div>

            {/* Notifications */}
            <div className="card mb-lg">
                <h3 className="mb-md">🔔 Notifications</h3>
                <div style={styles.settingRow}>
                    <div>
                        <div className="font-semibold">Browser Notifications</div>
                        <div className="text-sm text-secondary">
                            {notificationPermission === 'granted' ? 'Enabled' :
                                notificationPermission === 'denied' ? 'Blocked by browser' : 'Not enabled'}
                        </div>
                    </div>
                    <button
                        onClick={handleNotificationToggle}
                        className={`btn btn-sm ${settings.notifications ? 'btn-success' : 'btn-secondary'}`}
                        disabled={notificationPermission === 'denied'}
                    >
                        {settings.notifications ? 'Enabled' : 'Enable'}
                    </button>
                </div>

                <div style={styles.settingRow}>
                    <div>
                        <div className="font-semibold">Reminder Time</div>
                        <div className="text-sm text-secondary">Daily habit reminder</div>
                    </div>
                    <input
                        type="time"
                        className="input"
                        style={{ width: 'auto' }}
                        value={settings.reminderTime}
                        onChange={(e) => updateSettings({ reminderTime: e.target.value })}
                    />
                </div>

                <div style={styles.settingRow}>
                    <div>
                        <div className="font-semibold">Motivational Messages</div>
                        <div className="text-sm text-secondary">Show daily motivation</div>
                    </div>
                    <button
                        onClick={() => updateSettings({ motivationalMessages: !settings.motivationalMessages })}
                        className={`btn btn-sm ${settings.motivationalMessages ? 'btn-success' : 'btn-secondary'}`}
                    >
                        {settings.motivationalMessages ? 'On' : 'Off'}
                    </button>
                </div>
            </div>

            {/* Data Management */}
            <div className="card mb-lg">
                <h3 className="mb-md">💾 Data Management</h3>

                <div style={styles.settingRow}>
                    <div>
                        <div className="font-semibold">Export Data</div>
                        <div className="text-sm text-secondary">Download your habits and logs</div>
                    </div>
                    <button onClick={handleExport} className="btn btn-secondary btn-sm">
                        📥 Export
                    </button>
                </div>

                <div style={styles.settingRow}>
                    <div>
                        <div className="font-semibold">Import Data</div>
                        <div className="text-sm text-secondary">Restore from backup</div>
                    </div>
                    <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                        📤 Import
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>

                <div style={styles.settingRow}>
                    <div>
                        <div className="font-semibold text-error">Reset All Data</div>
                        <div className="text-sm text-secondary">Delete all habits and logs</div>
                    </div>
                    <button
                        onClick={() => setShowResetConfirm(true)}
                        className="btn btn-sm"
                        style={{ backgroundColor: 'var(--error-500)', color: 'white' }}
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Profile Edit Modal */}
            {showProfileEdit && (
                <div className="overlay" onClick={() => setShowProfileEdit(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="mb-md">Edit Profile</h2>

                        <div className="form-group">
                            <label className="label">Name</label>
                            <input
                                type="text"
                                className="input"
                                value={profileData.name || ''}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="label">Routine Preference</label>
                            <select
                                className="select"
                                value={profileData.routine || 'Flexible'}
                                onChange={(e) => setProfileData({ ...profileData, routine: e.target.value })}
                            >
                                <option value="Morning">Morning Person 🌅</option>
                                <option value="Flexible">Flexible Schedule ⏰</option>
                                <option value="Night">Night Owl 🌙</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="label">Focus Goal</label>
                            <select
                                className="select"
                                value={profileData.focus || 'Productivity'}
                                onChange={(e) => setProfileData({ ...profileData, focus: e.target.value })}
                            >
                                <option value="Productivity">Productivity 🚀</option>
                                <option value="Health">Health & Fitness 💪</option>
                                <option value="Learning">Learning & Growth 📚</option>
                                <option value="Self-care">Self-care & Wellness 🧘</option>
                            </select>
                        </div>

                        <div className="flex gap-sm justify-between">
                            <button onClick={() => setShowProfileEdit(false)} className="btn btn-secondary">
                                Cancel
                            </button>
                            <button onClick={handleProfileUpdate} className="btn btn-primary">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
                <div className="overlay" onClick={() => setShowResetConfirm(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="mb-md text-error">⚠️ Confirm Reset</h2>
                        <p className="mb-lg">
                            Are you sure you want to delete all your data? This action cannot be undone.
                            All habits, logs, and settings will be permanently deleted.
                        </p>
                        <div className="flex gap-sm justify-between">
                            <button onClick={() => setShowResetConfirm(false)} className="btn btn-secondary">
                                Cancel
                            </button>
                            <button
                                onClick={handleReset}
                                className="btn"
                                style={{ backgroundColor: 'var(--error-500)', color: 'white' }}
                            >
                                Yes, Reset Everything
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    settingRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 0',
        borderBottom: '1px solid var(--border-color)',
    },
};

export default SettingsPage;
