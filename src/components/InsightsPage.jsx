import React from 'react';
import { useHabit } from '../context/HabitContext';
import { analyzeHabitPatterns, generateWeeklySummary, getStreakInsight } from '../utils/aiInsights';

const InsightsPage = () => {
    const { habits, logs, userProfile, getHabitStats } = useHabit();

    const analysis = analyzeHabitPatterns(habits, logs);
    const weeklySummary = generateWeeklySummary(habits, logs);

    // Get top performing habit
    const topHabit = habits.length > 0 ? habits.reduce((best, current) => {
        const bestStats = getHabitStats(best.id);
        const currentStats = getHabitStats(current.id);
        return currentStats.currentStreak > bestStats.currentStreak ? current : best;
    }, habits[0]) : null;

    const topHabitStats = topHabit ? getHabitStats(topHabit.id) : null;

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            <h1 className="mb-lg">AI Insights 🤖</h1>

            {/* Weekly Summary */}
            <div className="card mb-lg" style={styles.summaryCard}>
                <h2 className="mb-md">{weeklySummary.title}</h2>
                <div className="flex items-center gap-lg mb-md">
                    <div style={styles.completionCircle}>
                        <div style={styles.completionValue}>{weeklySummary.completionRate}%</div>
                        <div className="text-sm text-secondary">This Week</div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <p className="text-lg font-semibold mb-sm">{weeklySummary.encouragement}</p>
                        <div className="progress">
                            <div
                                className="progress-bar progress-bar-success"
                                style={{ width: `${weeklySummary.completionRate}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Performing Habit */}
            {topHabit && topHabitStats && topHabitStats.currentStreak > 0 && (
                <div className="card mb-lg" style={styles.topHabitCard}>
                    <div className="flex items-center gap-md mb-md">
                        <span style={styles.topHabitIcon}>{topHabit.icon || '📌'}</span>
                        <div>
                            <h3 className="mb-xs">🏆 Top Performing Habit</h3>
                            <h2 style={styles.topHabitName}>{topHabit.name}</h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-md">
                        <div style={styles.statBox}>
                            <div style={styles.statNumber}>🔥 {topHabitStats.currentStreak}</div>
                            <div className="text-sm text-secondary">Current Streak</div>
                        </div>
                        <div style={styles.statBox}>
                            <div style={styles.statNumber}>⭐ {topHabitStats.longestStreak}</div>
                            <div className="text-sm text-secondary">Best Streak</div>
                        </div>
                        <div style={styles.statBox}>
                            <div style={styles.statNumber}>✅ {topHabitStats.completionRate}%</div>
                            <div className="text-sm text-secondary">Success Rate</div>
                        </div>
                    </div>
                    <div style={styles.insightBox}>
                        <p className="text-sm">{getStreakInsight(topHabitStats.currentStreak)}</p>
                    </div>
                </div>
            )}

            {/* AI Insights */}
            <div className="card mb-lg">
                <h3 className="mb-md">📊 Personalized Insights</h3>

                {analysis.insights.length > 0 ? (
                    <div style={styles.insightsList}>
                        {analysis.insights.map((insight, index) => (
                            <div key={index} className="card" style={styles.insightCard}>
                                <p style={styles.insightText}>{insight}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>📈</div>
                        <p className="text-secondary">
                            Keep logging your habits for a few days to unlock personalized insights!
                        </p>
                    </div>
                )}
            </div>

            {/* All Habits Overview */}
            {habits.length > 0 && (
                <div className="card">
                    <h3 className="mb-md">All Habits Overview</h3>
                    <div style={styles.habitsList}>
                        {habits.map(habit => {
                            const stats = getHabitStats(habit.id);
                            return (
                                <div key={habit.id} style={styles.habitRow}>
                                    <div className="flex items-center gap-sm" style={{ flex: 1 }}>
                                        <span style={styles.habitIcon}>{habit.icon || '📌'}</span>
                                        <span className="font-semibold">{habit.name}</span>
                                    </div>
                                    <div className="flex gap-md items-center">
                                        <div style={styles.miniStat}>
                                            <span className="text-sm text-secondary">Streak:</span>
                                            <span className="font-bold text-primary"> {stats.currentStreak}</span>
                                        </div>
                                        <div style={styles.miniStat}>
                                            <span className="text-sm text-secondary">Rate:</span>
                                            <span className="font-bold text-success"> {stats.completionRate}%</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    summaryCard: {
        background: 'linear-gradient(135deg, var(--primary-50), var(--success-50))',
        border: 'none',
    },
    completionCircle: {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-md)',
    },
    completionValue: {
        fontSize: '2rem',
        fontWeight: 700,
        color: 'var(--primary-600)',
    },
    topHabitCard: {
        background: 'linear-gradient(135deg, var(--warning-50), var(--success-50))',
        border: 'none',
    },
    topHabitIcon: {
        fontSize: '3rem',
    },
    topHabitName: {
        fontSize: '1.5rem',
        fontWeight: 700,
        margin: 0,
    },
    statBox: {
        textAlign: 'center',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: 'var(--radius-md)',
    },
    statNumber: {
        fontSize: '1.75rem',
        fontWeight: 700,
        marginBottom: '0.25rem',
    },
    insightBox: {
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: 'var(--radius-md)',
    },
    insightsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    insightCard: {
        background: 'linear-gradient(135deg, var(--primary-50), var(--bg-card))',
        border: 'none',
    },
    insightText: {
        fontSize: '0.9375rem',
        lineHeight: 1.6,
        margin: 0,
    },
    emptyState: {
        textAlign: 'center',
        padding: '2rem',
    },
    emptyIcon: {
        fontSize: '3rem',
        marginBottom: '1rem',
    },
    habitsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    habitRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
    },
    habitIcon: {
        fontSize: '1.5rem',
    },
    miniStat: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
    },
};

export default InsightsPage;
