// AI-powered habit insights generator (simulated)

const motivationalQuotes = [
    "Every small step counts. You're building something amazing!",
    "Consistency is the key to success. Keep going!",
    "Your future self will thank you for the habits you build today.",
    "Progress, not perfection. You're doing great!",
    "One day at a time. You've got this!",
    "The best time to start was yesterday. The next best time is now.",
    "Small habits, big results. Stay committed!",
    "You're stronger than you think. Keep pushing forward!",
    "Success is the sum of small efforts repeated daily.",
    "Believe in yourself. You're making it happen!",
];

const routineMessages = {
    Morning: [
        "Good morning! Start your day strong with your habits.",
        "Rise and shine! Your morning routine sets the tone for success.",
        "A productive morning leads to a productive day!",
    ],
    Flexible: [
        "Find your rhythm today. Your habits, your schedule!",
        "Flexibility is your strength. Make today count!",
        "Adapt and thrive. You're in control!",
    ],
    Night: [
        "Evening is your power time. Finish strong!",
        "Night owl mode activated. Let's build those habits!",
        "End your day with purpose and intention.",
    ],
};

const focusMessages = {
    Productivity: [
        "Your productivity streak is inspiring!",
        "Efficient habits lead to extraordinary results.",
        "You're building a productivity powerhouse!",
    ],
    Health: [
        "Your health is your wealth. Keep investing!",
        "Every healthy choice is a step toward a better you.",
        "Your body and mind thank you for these habits!",
    ],
    Learning: [
        "Knowledge compounds. Keep learning daily!",
        "Your curiosity is your superpower!",
        "Every day is a chance to grow smarter!",
    ],
    'Self-care': [
        "Taking care of yourself isn't selfish, it's essential.",
        "You deserve the care you give yourself.",
        "Self-care is the foundation of everything else!",
    ],
};

// Generate daily motivational message
export const getDailyMotivation = (userProfile) => {
    const baseQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

    if (!userProfile) return baseQuote;

    const routineQuotes = routineMessages[userProfile.routine] || [];
    const focusQuotes = focusMessages[userProfile.focus] || [];

    const allQuotes = [baseQuote, ...routineQuotes, ...focusQuotes];
    return allQuotes[Math.floor(Math.random() * allQuotes.length)];
};

// Analyze habit completion patterns
export const analyzeHabitPatterns = (habits, logs) => {
    if (!logs || logs.length === 0) {
        return {
            insights: [],
            summary: "Start logging your habits to get personalized insights!",
        };
    }

    const insights = [];
    const today = new Date().toISOString().split('T')[0];
    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split('T')[0]);
    }

    // Calculate weekly completion rate
    const weeklyLogs = logs.filter(log => last7Days.includes(log.date));
    const completedCount = weeklyLogs.filter(log => log.completed).length;
    const totalExpected = habits.length * 7;
    const completionRate = totalExpected > 0 ? (completedCount / totalExpected) * 100 : 0;

    // Best performing habits
    const habitStats = habits.map(habit => {
        const habitLogs = weeklyLogs.filter(log => log.habitId === habit.id);
        const completed = habitLogs.filter(log => log.completed).length;
        return { ...habit, weeklyCompletion: completed };
    });

    const bestHabit = habitStats.reduce((best, current) =>
        current.weeklyCompletion > best.weeklyCompletion ? current : best
        , habitStats[0]);

    if (bestHabit && bestHabit.weeklyCompletion > 0) {
        insights.push(`🌟 "${bestHabit.name}" is your star habit this week with ${bestHabit.weeklyCompletion} completions!`);
    }

    // Completion rate feedback
    if (completionRate >= 80) {
        insights.push(`🔥 Amazing! You're at ${completionRate.toFixed(0)}% completion this week. Keep this momentum!`);
    } else if (completionRate >= 60) {
        insights.push(`💪 Good progress at ${completionRate.toFixed(0)}% completion. You're building consistency!`);
    } else if (completionRate >= 40) {
        insights.push(`📈 You're at ${completionRate.toFixed(0)}% this week. Small improvements lead to big results!`);
    } else if (completionRate > 0) {
        insights.push(`🌱 Starting fresh? ${completionRate.toFixed(0)}% is a beginning. Every journey starts with a single step!`);
    }

    // Day of week analysis
    const dayStats = {};
    weeklyLogs.forEach(log => {
        const day = new Date(log.date).toLocaleDateString('en-US', { weekday: 'long' });
        if (!dayStats[day]) dayStats[day] = { total: 0, completed: 0 };
        dayStats[day].total++;
        if (log.completed) dayStats[day].completed++;
    });

    const bestDay = Object.entries(dayStats).reduce((best, [day, stats]) => {
        const rate = stats.completed / stats.total;
        return rate > (best.rate || 0) ? { day, rate } : best;
    }, {});

    if (bestDay.day) {
        insights.push(`📅 ${bestDay.day}s are your most consistent days. Try scheduling important habits then!`);
    }

    // Missed habits
    const missedHabits = habitStats.filter(h => h.weeklyCompletion === 0);
    if (missedHabits.length > 0 && missedHabits.length < habits.length) {
        insights.push(`💡 "${missedHabits[0].name}" needs some attention. Start with just one completion this week!`);
    }

    return {
        insights,
        completionRate: completionRate.toFixed(1),
        summary: insights.length > 0 ? insights.join('\n\n') : "Keep tracking to unlock insights!",
    };
};

// Generate weekly summary
export const generateWeeklySummary = (habits, logs) => {
    const analysis = analyzeHabitPatterns(habits, logs);

    const summary = {
        title: "Your Weekly Habit Summary",
        completionRate: analysis.completionRate,
        insights: analysis.insights,
        encouragement: analysis.completionRate >= 70
            ? "Outstanding week! You're building incredible momentum."
            : "Every week is a fresh start. You're making progress!",
    };

    return summary;
};

// Get personalized habit suggestions
export const getHabitSuggestions = (userProfile) => {
    const suggestions = {
        Productivity: [
            { name: "Morning Planning", icon: "📝", description: "Plan your day every morning" },
            { name: "Deep Work Session", icon: "🎯", description: "1 hour of focused work" },
            { name: "Email Inbox Zero", icon: "📧", description: "Clear your inbox daily" },
            { name: "Learn Something New", icon: "📚", description: "15 minutes of learning" },
        ],
        Health: [
            { name: "Morning Exercise", icon: "🏃", description: "30 minutes of physical activity" },
            { name: "Drink Water", icon: "💧", description: "8 glasses throughout the day" },
            { name: "Healthy Meal Prep", icon: "🥗", description: "Prepare nutritious meals" },
            { name: "Evening Stretch", icon: "🧘", description: "10 minutes of stretching" },
        ],
        Learning: [
            { name: "Read Daily", icon: "📖", description: "Read for 30 minutes" },
            { name: "Practice a Skill", icon: "🎨", description: "Dedicate time to skill building" },
            { name: "Watch Educational Content", icon: "🎓", description: "Learn from videos/courses" },
            { name: "Journal Learnings", icon: "✍️", description: "Write down what you learned" },
        ],
        'Self-care': [
            { name: "Meditation", icon: "🧘‍♀️", description: "10 minutes of mindfulness" },
            { name: "Gratitude Journal", icon: "🙏", description: "Write 3 things you're grateful for" },
            { name: "Digital Detox Hour", icon: "📵", description: "1 hour without screens" },
            { name: "Quality Sleep", icon: "😴", description: "8 hours of restful sleep" },
        ],
    };

    return suggestions[userProfile?.focus] || suggestions.Productivity;
};

// Generate insight based on streak
export const getStreakInsight = (streak) => {
    if (streak >= 30) {
        return "🏆 Incredible! 30+ day streak! You're a habit master!";
    } else if (streak >= 21) {
        return "🎉 21 days! Scientists say it takes 21 days to form a habit. You did it!";
    } else if (streak >= 14) {
        return "💎 Two weeks strong! You're in the habit formation zone!";
    } else if (streak >= 7) {
        return "🌟 One week streak! The momentum is building!";
    } else if (streak >= 3) {
        return "🔥 Three days in a row! Keep the fire burning!";
    } else if (streak >= 1) {
        return "✨ Great start! Every streak begins with day one!";
    }
    return "🌱 Ready to start your streak? Today is day one!";
};

// Get contextual encouragement
export const getEncouragement = (completionRate, missedDays) => {
    if (completionRate >= 90) {
        return "You're absolutely crushing it! Your consistency is remarkable!";
    } else if (completionRate >= 75) {
        return "Excellent work! You're building strong, lasting habits!";
    } else if (completionRate >= 50) {
        return "You're making solid progress. Keep building on this foundation!";
    } else if (missedDays > 3) {
        return "Life happens! Don't be too hard on yourself. Start fresh today!";
    } else {
        return "Every day is a new opportunity. You've got this!";
    }
};
