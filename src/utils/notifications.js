// Web Notifications API wrapper for habit reminders

// Check if notifications are supported
export const isNotificationSupported = () => {
    return 'Notification' in window;
};

// Get current notification permission
export const getNotificationPermission = () => {
    if (!isNotificationSupported()) return 'denied';
    return Notification.permission;
};

// Request notification permission
export const requestNotificationPermission = async () => {
    if (!isNotificationSupported()) {
        return 'denied';
    }

    try {
        const permission = await Notification.requestPermission();
        return permission;
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return 'denied';
    }
};

// Show a notification
export const showNotification = (title, options = {}) => {
    if (!isNotificationSupported() || Notification.permission !== 'granted') {
        console.warn('Notifications not available or not permitted');
        return null;
    }

    try {
        const notification = new Notification(title, {
            icon: '/vite.svg',
            badge: '/vite.svg',
            ...options,
        });

        return notification;
    } catch (error) {
        console.error('Error showing notification:', error);
        return null;
    }
};

// Show habit reminder notification
export const showHabitReminder = (habitName) => {
    return showNotification('Habit Reminder', {
        body: `Time to complete your habit: ${habitName}`,
        tag: `habit-${habitName}`,
        requireInteraction: false,
    });
};

// Schedule daily reminders (simplified - in production use service workers)
export const scheduleDailyReminder = (time, habitName) => {
    if (Notification.permission !== 'granted') {
        return null;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const delay = scheduledTime - now;

    const timeoutId = setTimeout(() => {
        showHabitReminder(habitName);
        // Reschedule for next day
        scheduleDailyReminder(time, habitName);
    }, delay);

    return timeoutId;
};

// Cancel scheduled reminder
export const cancelReminder = (timeoutId) => {
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
};

// Show test notification
export const showTestNotification = () => {
    return showNotification('Test Notification', {
        body: 'Notifications are working! You\'ll receive habit reminders at your scheduled time.',
    });
};
