// LocalStorage utility functions for data persistence

const STORAGE_KEYS = {
  USER_PROFILE: 'habitTracker_userProfile',
  HABITS: 'habitTracker_habits',
  LOGS: 'habitTracker_logs',
  SETTINGS: 'habitTracker_settings',
};

// Get data from localStorage
export const getStorageData = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return null;
  }
};

// Set data to localStorage
export const setStorageData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
    return false;
  }
};

// Remove data from localStorage
export const removeStorageData = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};

// User Profile
export const getUserProfile = () => {
  return getStorageData(STORAGE_KEYS.USER_PROFILE);
};

export const setUserProfile = (profile) => {
  return setStorageData(STORAGE_KEYS.USER_PROFILE, profile);
};

// Habits
export const getHabits = () => {
  return getStorageData(STORAGE_KEYS.HABITS) || [];
};

export const setHabits = (habits) => {
  return setStorageData(STORAGE_KEYS.HABITS, habits);
};

// Logs
export const getLogs = () => {
  return getStorageData(STORAGE_KEYS.LOGS) || [];
};

export const setLogs = (logs) => {
  return setStorageData(STORAGE_KEYS.LOGS, logs);
};

// Settings
export const getSettings = () => {
  return getStorageData(STORAGE_KEYS.SETTINGS) || {
    theme: 'light',
    notifications: false,
    motivationalMessages: true,
    reminderTime: '09:00',
  };
};

export const setSettings = (settings) => {
  return setStorageData(STORAGE_KEYS.SETTINGS, settings);
};

// Export all data
export const exportAllData = () => {
  return {
    profile: getUserProfile(),
    habits: getHabits(),
    logs: getLogs(),
    settings: getSettings(),
    exportDate: new Date().toISOString(),
  };
};

// Import all data
export const importAllData = (data) => {
  try {
    if (data.profile) setUserProfile(data.profile);
    if (data.habits) setHabits(data.habits);
    if (data.logs) setLogs(data.logs);
    if (data.settings) setSettings(data.settings);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

// Clear all data
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};
