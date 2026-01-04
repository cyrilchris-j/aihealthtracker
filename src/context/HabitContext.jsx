import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    getUserProfile,
    setUserProfile,
    getHabits,
    setHabits,
    getLogs,
    setLogs,
    getSettings,
    setSettings,
    exportAllData,
    importAllData,
    clearAllData,
} from '../utils/storage';
import { getTodayString, calculateStreak } from '../utils/dateHelpers';

const HabitContext = createContext();

export const useHabit = () => {
    const context = useContext(HabitContext);
    if (!context) {
        throw new Error('useHabit must be used within HabitProvider');
    }
    return context;
};

export const HabitProvider = ({ children }) => {
    const [userProfile, setUserProfileState] = useState(null);
    const [habits, setHabitsState] = useState([]);
    const [logs, setLogsState] = useState([]);
    const [settings, setSettingsState] = useState({
        theme: 'light',
        notifications: false,
        motivationalMessages: true,
        reminderTime: '09:00',
    });
    const [loading, setLoading] = useState(true);

    // Load data from localStorage on mount
    useEffect(() => {
        const loadData = () => {
            const profile = getUserProfile();
            const savedHabits = getHabits();
            const savedLogs = getLogs();
            const savedSettings = getSettings();

            setUserProfileState(profile);
            setHabitsState(savedHabits);
            setLogsState(savedLogs);
            setSettingsState(savedSettings);

            // Apply theme
            if (savedSettings.theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
            }

            setLoading(false);
        };

        loadData();
    }, []);

    // User Profile Methods
    const updateUserProfile = (profile) => {
        setUserProfileState(profile);
        setUserProfile(profile);
    };

    // Habit Methods
    const addHabit = (habit) => {
        const newHabit = {
            ...habit,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        const updatedHabits = [...habits, newHabit];
        setHabitsState(updatedHabits);
        setHabits(updatedHabits);
        return newHabit;
    };

    const updateHabit = (habitId, updates) => {
        const updatedHabits = habits.map(habit =>
            habit.id === habitId ? { ...habit, ...updates } : habit
        );
        setHabitsState(updatedHabits);
        setHabits(updatedHabits);
    };

    const deleteHabit = (habitId) => {
        const updatedHabits = habits.filter(habit => habit.id !== habitId);
        const updatedLogs = logs.filter(log => log.habitId !== habitId);
        setHabitsState(updatedHabits);
        setLogsState(updatedLogs);
        setHabits(updatedHabits);
        setLogs(updatedLogs);
    };

    // Log Methods
    const logHabit = (habitId, date, completed, notes = '') => {
        const existingLogIndex = logs.findIndex(
            log => log.habitId === habitId && log.date === date
        );

        let updatedLogs;
        if (existingLogIndex >= 0) {
            // Update existing log
            updatedLogs = [...logs];
            updatedLogs[existingLogIndex] = {
                ...updatedLogs[existingLogIndex],
                completed,
                notes,
                updatedAt: new Date().toISOString(),
            };
        } else {
            // Create new log
            const newLog = {
                id: Date.now().toString(),
                habitId,
                date,
                completed,
                notes,
                createdAt: new Date().toISOString(),
            };
            updatedLogs = [...logs, newLog];
        }

        setLogsState(updatedLogs);
        setLogs(updatedLogs);
    };

    const getHabitLog = (habitId, date) => {
        return logs.find(log => log.habitId === habitId && log.date === date);
    };

    const getTodayLogs = () => {
        const today = getTodayString();
        return logs.filter(log => log.date === today);
    };

    // Statistics Methods
    const getHabitStats = (habitId) => {
        const habitLogs = logs.filter(log => log.habitId === habitId);
        const completedLogs = habitLogs.filter(log => log.completed);
        const streak = calculateStreak(logs, habitId);

        const totalDays = habitLogs.length;
        const completedDays = completedLogs.length;
        const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

        return {
            totalDays,
            completedDays,
            completionRate: completionRate.toFixed(1),
            currentStreak: streak.current,
            longestStreak: streak.longest,
        };
    };

    const getOverallStats = () => {
        const today = getTodayString();
        const todayLogs = logs.filter(log => log.date === today);
        const completedToday = todayLogs.filter(log => log.completed).length;
        const totalToday = habits.length;
        const todayCompletion = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

        const allCompleted = logs.filter(log => log.completed).length;
        const allTotal = logs.length;
        const overallCompletion = allTotal > 0 ? (allCompleted / allTotal) * 100 : 0;

        return {
            todayCompletion: todayCompletion.toFixed(1),
            completedToday,
            totalToday,
            overallCompletion: overallCompletion.toFixed(1),
            totalHabits: habits.length,
            totalLogs: logs.length,
        };
    };

    // Settings Methods
    const updateSettings = (newSettings) => {
        const updated = { ...settings, ...newSettings };
        setSettingsState(updated);
        setSettings(updated);

        // Apply theme
        if (updated.theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    };

    // Data Management
    const exportData = () => {
        return exportAllData();
    };

    const importData = (data) => {
        const success = importAllData(data);
        if (success) {
            // Reload data
            setUserProfileState(getUserProfile());
            setHabitsState(getHabits());
            setLogsState(getLogs());
            setSettingsState(getSettings());
        }
        return success;
    };

    const resetAllData = () => {
        const success = clearAllData();
        if (success) {
            setUserProfileState(null);
            setHabitsState([]);
            setLogsState([]);
            setSettingsState({
                theme: 'light',
                notifications: false,
                motivationalMessages: true,
                reminderTime: '09:00',
            });
            document.documentElement.removeAttribute('data-theme');
        }
        return success;
    };

    const value = {
        // State
        userProfile,
        habits,
        logs,
        settings,
        loading,

        // User Profile
        updateUserProfile,

        // Habits
        addHabit,
        updateHabit,
        deleteHabit,

        // Logs
        logHabit,
        getHabitLog,
        getTodayLogs,

        // Stats
        getHabitStats,
        getOverallStats,

        // Settings
        updateSettings,

        // Data Management
        exportData,
        importData,
        resetAllData,
    };

    return (
        <HabitContext.Provider value={value}>
            {children}
        </HabitContext.Provider>
    );
};
