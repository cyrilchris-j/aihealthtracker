import React, { useState } from 'react';
import { useHabit } from '../context/HabitContext';
import { getLastNDays, getDayName, formatDate } from '../utils/dateHelpers';

const AnalyticsPage = () => {
    const { habits, logs, getHabitStats } = useHabit();
    const [timeRange, setTimeRange] = useState(7);
    const [selectedHabit, setSelectedHabit] = useState('all');

    // Get data for the selected time range
    const dates = getLastNDays(timeRange);

    // Calculate daily completion rates
    const dailyData = dates.map(date => {
        const dayLogs = logs.filter(log => log.date === date);
        const completed = dayLogs.filter(log => log.completed).length;
        const total = selectedHabit === 'all' ? habits.length : 1;
        const rate = total > 0 ? (completed / total) * 100 : 0;

        return {
            date,
            day: getDayName(date),
            completed,
            total,
            rate: rate.toFixed(0),
        };
    });

    // Calculate overall stats
    const totalLogs = logs.filter(log => dates.includes(log.date));
    const completedLogs = totalLogs.filter(log => log.completed);
    const overallRate = totalLogs.length > 0
        ? ((completedLogs.length / totalLogs.length) * 100).toFixed(1)
        : 0;

    // Best and worst days
    const bestDay = dailyData.reduce((best, current) =>
        parseFloat(current.rate) > parseFloat(best.rate) ? current : best
        , dailyData[0]);

    const worstDay = dailyData.reduce((worst, current) =>
        parseFloat(current.rate) < parseFloat(worst.rate) ? current : worst
        , dailyData[0]);

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            <div className="flex justify-between items-center mb-lg">
                <h1>Analytics 📈</h1>
                <div className="flex gap-sm">
                    <select
                        className="select"
                        value={timeRange}
                        onChange={(e) => setTimeRange(Number(e.target.value))}
                        style={{ width: 'auto' }}
                    >
                        <option value={7}>Last 7 Days</option>
                        <option value={14}>Last 14 Days</option>
                        <option value={30}>Last 30 Days</option>
                    </select>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-md mb-lg">
                <div className="card text-center">
                    <div style={styles.statValue}>{overallRate}%</div>
                    <div className="text-secondary text-sm">Overall Completion</div>
                </div>
                <div className="card text-center">
                    <div style={styles.statValue}>{completedLogs.length}</div>
                    <div className="text-secondary text-sm">Habits Completed</div>
                </div>
                <div className="card text-center">
                    <div style={styles.statValue}>{totalLogs.length}</div>
                    <div className="text-secondary text-sm">Total Logs</div>
                </div>
            </div>

            {/* Daily Completion Chart */}
            <div className="card mb-lg">
                <h3 className="mb-md">Daily Completion Rate</h3>
                <div style={styles.chartContainer}>
                    <div style={styles.chart}>
                        {dailyData.map((day, index) => (
                            <div key={index} style={styles.barContainer}>
                                <div style={styles.barWrapper}>
                                    <div
                                        style={{
                                            ...styles.bar,
                                            height: `${day.rate}%`,
                                            backgroundColor: parseFloat(day.rate) >= 80
                                                ? 'var(--success-500)'
                                                : parseFloat(day.rate) >= 50
                                                    ? 'var(--primary-500)'
                                                    : 'var(--warning-500)',
                                        }}
                                        title={`${day.rate}% (${day.completed}/${day.total})`}
                                    >
                                        <span style={styles.barLabel}>{day.rate}%</span>
                                    </div>
                                </div>
                                <div style={styles.barDay}>{day.day}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Best & Worst Days */}
            <div className="grid grid-cols-2 gap-md mb-lg">
                <div className="card" style={{ background: 'linear-gradient(135deg, var(--success-50), var(--bg-card))' }}>
                    <h4 className="mb-sm">🏆 Best Day</h4>
                    <div className="text-lg font-bold text-success">{bestDay?.day}</div>
                    <div className="text-sm text-secondary">{bestDay?.rate}% completion</div>
                </div>
                <div className="card" style={{ background: 'linear-gradient(135deg, var(--warning-50), var(--bg-card))' }}>
                    <h4 className="mb-sm">📊 Needs Focus</h4>
                    <div className="text-lg font-bold text-warning">{worstDay?.day}</div>
                    <div className="text-sm text-secondary">{worstDay?.rate}% completion</div>
                </div>
            </div>

            {/* Habit Breakdown */}
            <div className="card">
                <h3 className="mb-md">Habit Performance</h3>
                {habits.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p className="text-secondary">No habits to analyze yet.</p>
                    </div>
                ) : (
                    <div style={styles.habitList}>
                        {habits.map(habit => {
                            const stats = getHabitStats(habit.id);
                            return (
                                <div key={habit.id} style={styles.habitRow}>
                                    <div className="flex items-center gap-sm" style={{ flex: 1 }}>
                                        <span style={styles.habitIcon}>{habit.icon || '📌'}</span>
                                        <div>
                                            <div className="font-semibold">{habit.name}</div>
                                            <div className="text-sm text-secondary">
                                                {stats.completedDays} of {stats.totalDays} days
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ width: '200px' }}>
                                        <div className="flex justify-between items-center mb-xs">
                                            <span className="text-sm text-secondary">Success Rate</span>
                                            <span className="font-bold text-primary">{stats.completionRate}%</span>
                                        </div>
                                        <div className="progress">
                                            <div
                                                className={`progress-bar ${parseFloat(stats.completionRate) >= 80 ? 'progress-bar-success' : ''}`}
                                                style={{ width: `${stats.completionRate}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div style={styles.streakBadge}>
                                        <div className="text-sm text-secondary">Streak</div>
                                        <div className="font-bold text-warning">🔥 {stats.currentStreak}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    statValue: {
        fontSize: '2.5rem',
        fontWeight: 700,
        color: 'var(--primary-600)',
        marginBottom: '0.5rem',
    },
    chartContainer: {
        padding: '1rem 0',
    },
    chart: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: '250px',
        gap: '0.5rem',
    },
    barContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
    },
    barWrapper: {
        width: '100%',
        height: '200px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    bar: {
        width: '100%',
        minHeight: '4px',
        borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '0.25rem',
        position: 'relative',
    },
    barLabel: {
        fontSize: '0.75rem',
        fontWeight: 600,
        color: 'white',
    },
    barDay: {
        fontSize: '0.75rem',
        fontWeight: 500,
        color: 'var(--text-secondary)',
        textAlign: 'center',
    },
    emptyState: {
        textAlign: 'center',
        padding: '2rem',
    },
    habitList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    habitRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
    },
    habitIcon: {
        fontSize: '1.5rem',
    },
    streakBadge: {
        textAlign: 'center',
        minWidth: '80px',
    },
};

export default AnalyticsPage;
