import React, { useState } from 'react';
import { useHabit } from '../context/HabitContext';
import { getTodayString, formatDate } from '../utils/dateHelpers';
import { getDailyMotivation } from '../utils/aiInsights';

const Dashboard = () => {
    const { habits, userProfile, getOverallStats, logHabit, getHabitLog, getHabitStats, settings } = useHabit();
    const [selectedHabit, setSelectedHabit] = useState(null);
    const [notes, setNotes] = useState('');

    const today = getTodayString();
    const stats = getOverallStats();
    const motivation = settings.motivationalMessages ? getDailyMotivation(userProfile) : null;

    const handleToggleHabit = (habitId) => {
        const log = getHabitLog(habitId, today);
        const newStatus = !log?.completed;
        logHabit(habitId, today, newStatus, log?.notes || '');
    };

    const handleSkipHabit = (habitId) => {
        logHabit(habitId, today, false, 'Skipped');
    };

    const handleAddNotes = (habitId) => {
        const log = getHabitLog(habitId, today);
        logHabit(habitId, today, log?.completed || false, notes);
        setSelectedHabit(null);
        setNotes('');
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            {/* Header */}
            <div className="mb-lg">
                <h1 className="mb-sm">
                    {userProfile?.name ? `Welcome back, ${userProfile.name}!` : 'Welcome back!'} 👋
                </h1>
                <p className="text-secondary">{formatDate(today)}</p>
            </div>

            {/* Motivational Message */}
            {motivation && (
                <div className="card mb-lg fade-in" style={styles.motivationCard}>
                    <div style={styles.motivationIcon}>💡</div>
                    <p style={styles.motivationText}>{motivation}</p>
                </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-md mb-lg">
                <div className="card text-center">
                    <div style={styles.statValue}>{stats.completedToday}/{stats.totalToday}</div>
                    <div className="text-secondary text-sm">Today's Habits</div>
                </div>
                <div className="card text-center">
                    <div style={styles.statValue}>{stats.todayCompletion}%</div>
                    <div className="text-secondary text-sm">Completion Rate</div>
                </div>
                <div className="card text-center">
                    <div style={styles.statValue}>{stats.totalHabits}</div>
                    <div className="text-secondary text-sm">Active Habits</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="card mb-lg">
                <div className="flex justify-between items-center mb-sm">
                    <span className="font-semibold">Today's Progress</span>
                    <span className="text-primary font-bold">{stats.todayCompletion}%</span>
                </div>
                <div className="progress">
                    <div
                        className={`progress-bar ${parseFloat(stats.todayCompletion) >= 80 ? 'progress-bar-success' : ''}`}
                        style={{ width: `${stats.todayCompletion}%` }}
                    />
                </div>
            </div>

            {/* Today's Habits */}
            <div className="card">
                <h3 className="mb-md">Today's Habits ✅</h3>

                {habits.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>🎯</div>
                        <p className="text-secondary">No habits yet. Create your first habit to get started!</p>
                    </div>
                ) : (
                    <div style={styles.habitList}>
                        {habits.map(habit => {
                            const log = getHabitLog(habit.id, today);
                            const habitStats = getHabitStats(habit.id);
                            const isCompleted = log?.completed || false;

                            return (
                                <div key={habit.id} className="card" style={styles.habitCard}>
                                    <div className="flex items-center gap-md">
                                        {/* Checkbox */}
                                        <button
                                            onClick={() => handleToggleHabit(habit.id)}
                                            style={{
                                                ...styles.checkbox,
                                                backgroundColor: isCompleted ? 'var(--success-500)' : 'transparent',
                                                borderColor: isCompleted ? 'var(--success-500)' : 'var(--border-color)',
                                            }}
                                        >
                                            {isCompleted && <span style={styles.checkmark}>✓</span>}
                                        </button>

                                        {/* Habit Info */}
                                        <div style={{ flex: 1 }}>
                                            <div className="flex items-center gap-sm mb-xs">
                                                <span style={styles.habitIcon}>{habit.icon || '📌'}</span>
                                                <h4 style={{
                                                    ...styles.habitName,
                                                    textDecoration: isCompleted ? 'line-through' : 'none',
                                                    opacity: isCompleted ? 0.7 : 1,
                                                }}>
                                                    {habit.name}
                                                </h4>
                                            </div>

                                            {/* Streak */}
                                            {habitStats.currentStreak > 0 && (
                                                <div className="flex items-center gap-sm">
                                                    <span className="badge badge-warning">
                                                        🔥 {habitStats.currentStreak} day streak
                                                    </span>
                                                    {log?.notes && (
                                                        <span className="text-sm text-secondary">📝 {log.notes}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-sm">
                                            <button
                                                onClick={() => {
                                                    setSelectedHabit(habit.id);
                                                    setNotes(log?.notes || '');
                                                }}
                                                className="btn btn-ghost btn-sm"
                                                title="Add notes"
                                            >
                                                📝
                                            </button>
                                            <button
                                                onClick={() => handleSkipHabit(habit.id)}
                                                className="btn btn-ghost btn-sm"
                                                title="Skip today"
                                            >
                                                ⏭️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Notes Modal */}
            {selectedHabit && (
                <div className="overlay" onClick={() => setSelectedHabit(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="mb-md">Add Notes</h3>
                        <textarea
                            className="textarea mb-md"
                            placeholder="How did it go? Any thoughts?"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            autoFocus
                        />
                        <div className="flex gap-sm justify-between">
                            <button
                                onClick={() => setSelectedHabit(null)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleAddNotes(selectedHabit)}
                                className="btn btn-primary"
                            >
                                Save Notes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    motivationCard: {
        background: 'linear-gradient(135deg, var(--primary-50), var(--success-50))',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    motivationIcon: {
        fontSize: '2rem',
    },
    motivationText: {
        fontSize: '1rem',
        fontWeight: 500,
        color: 'var(--text-primary)',
        margin: 0,
    },
    statValue: {
        fontSize: '2rem',
        fontWeight: 700,
        color: 'var(--primary-600)',
        marginBottom: '0.25rem',
    },
    emptyState: {
        textAlign: 'center',
        padding: '3rem 1rem',
    },
    emptyIcon: {
        fontSize: '4rem',
        marginBottom: '1rem',
    },
    habitList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    habitCard: {
        padding: '1rem',
        transition: 'all 0.2s',
        cursor: 'pointer',
    },
    checkbox: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: '2px solid',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        flexShrink: 0,
    },
    checkmark: {
        color: 'white',
        fontSize: '1.25rem',
        fontWeight: 'bold',
    },
    habitIcon: {
        fontSize: '1.25rem',
    },
    habitName: {
        fontSize: '1rem',
        fontWeight: 600,
        margin: 0,
        color: 'var(--text-primary)',
    },
};

export default Dashboard;
