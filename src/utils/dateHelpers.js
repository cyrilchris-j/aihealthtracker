// Date and time helper functions

// Format date to readable string
export const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Get today's date in YYYY-MM-DD format
export const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

// Get date string from Date object
export const getDateString = (date) => {
    return new Date(date).toISOString().split('T')[0];
};

// Check if two dates are the same day
export const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
};

// Get days between two dates
export const getDaysBetween = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Get start of week (Monday)
export const getStartOfWeek = (date = new Date()) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
};

// Get end of week (Sunday)
export const getEndOfWeek = (date = new Date()) => {
    const start = getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end;
};

// Get dates for current week
export const getCurrentWeekDates = () => {
    const start = getStartOfWeek();
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        dates.push(getDateString(date));
    }
    return dates;
};

// Get start of month
export const getStartOfMonth = (date = new Date()) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
};

// Get end of month
export const getEndOfMonth = (date = new Date()) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

// Get all dates in current month
export const getCurrentMonthDates = () => {
    const start = getStartOfMonth();
    const end = getEndOfMonth();
    const dates = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(getDateString(d));
    }

    return dates;
};

// Calculate streak from logs
export const calculateStreak = (logs, habitId) => {
    if (!logs || logs.length === 0) {
        return { current: 0, longest: 0 };
    }

    // Filter and sort logs for this habit
    const habitLogs = logs
        .filter(log => log.habitId === habitId && log.completed)
        .map(log => log.date)
        .sort((a, b) => new Date(b) - new Date(a));

    if (habitLogs.length === 0) {
        return { current: 0, longest: 0 };
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const today = getTodayString();
    const yesterday = getDateString(new Date(Date.now() - 86400000));

    // Check if streak is active (completed today or yesterday)
    if (habitLogs[0] === today || habitLogs[0] === yesterday) {
        currentStreak = 1;

        // Calculate current streak
        for (let i = 1; i < habitLogs.length; i++) {
            const daysDiff = getDaysBetween(habitLogs[i], habitLogs[i - 1]);
            if (daysDiff === 1) {
                currentStreak++;
            } else {
                break;
            }
        }
    }

    // Calculate longest streak
    longestStreak = tempStreak;
    for (let i = 1; i < habitLogs.length; i++) {
        const daysDiff = getDaysBetween(habitLogs[i], habitLogs[i - 1]);
        if (daysDiff === 1) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 1;
        }
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    return { current: currentStreak, longest: longestStreak };
};

// Get day name from date
export const getDayName = (date) => {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
};

// Get month name from date
export const getMonthName = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'long' });
};

// Check if date is today
export const isToday = (date) => {
    return isSameDay(date, new Date());
};

// Check if date is in the past
export const isPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) < today;
};

// Get last N days
export const getLastNDays = (n) => {
    const dates = [];
    for (let i = n - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(getDateString(date));
    }
    return dates;
};
