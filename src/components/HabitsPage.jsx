import React, { useState } from 'react';
import { useHabit } from '../context/HabitContext';
import { getHabitSuggestions } from '../utils/aiInsights';

const HabitsPage = () => {
    const { habits, userProfile, addHabit, updateHabit, deleteHabit, getHabitStats } = useHabit();
    const [showForm, setShowForm] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        icon: '📌',
        type: 'Daily',
        goal: '',
    });

    const suggestions = getHabitSuggestions(userProfile);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingHabit) {
            updateHabit(editingHabit.id, formData);
        } else {
            addHabit(formData);
        }
        resetForm();
    };

    const handleEdit = (habit) => {
        setEditingHabit(habit);
        setFormData({
            name: habit.name,
            icon: habit.icon || '📌',
            type: habit.type || 'Daily',
            goal: habit.goal || '',
        });
        setShowForm(true);
    };

    const handleDelete = (habitId) => {
        if (window.confirm('Are you sure you want to delete this habit? All logs will be removed.')) {
            deleteHabit(habitId);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', icon: '📌', type: 'Daily', goal: '' });
        setEditingHabit(null);
        setShowForm(false);
    };

    const handleTemplateSelect = (template) => {
        setFormData({
            name: template.name,
            icon: template.icon,
            type: 'Daily',
            goal: template.description,
        });
        setShowTemplates(false);
        setShowForm(true);
    };

    const iconOptions = ['📌', '🏃', '📚', '💧', '🧘', '✍️', '🎯', '💪', '🎨', '🌱', '⚡', '🔥'];

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            <div className="flex justify-between items-center mb-lg">
                <h1>My Habits ✅</h1>
                <div className="flex gap-sm">
                    <button
                        onClick={() => setShowTemplates(true)}
                        className="btn btn-secondary"
                    >
                        📋 Templates
                    </button>
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn btn-primary"
                    >
                        + New Habit
                    </button>
                </div>
            </div>

            {/* Habits List */}
            {habits.length === 0 ? (
                <div className="card" style={styles.emptyState}>
                    <div style={styles.emptyIcon}>🎯</div>
                    <h3 className="mb-sm">No Habits Yet</h3>
                    <p className="text-secondary mb-md">
                        Start building better habits today! Create your first habit or choose from templates.
                    </p>
                    <div className="flex gap-sm justify-center">
                        <button onClick={() => setShowTemplates(true)} className="btn btn-secondary">
                            Browse Templates
                        </button>
                        <button onClick={() => setShowForm(true)} className="btn btn-primary">
                            Create Habit
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-md">
                    {habits.map(habit => {
                        const stats = getHabitStats(habit.id);
                        return (
                            <div key={habit.id} className="card" style={styles.habitCard}>
                                <div className="flex justify-between items-start mb-md">
                                    <div className="flex items-center gap-sm">
                                        <span style={styles.habitIcon}>{habit.icon || '📌'}</span>
                                        <div>
                                            <h3 style={styles.habitName}>{habit.name}</h3>
                                            <span className="badge badge-primary">{habit.type || 'Daily'}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-sm">
                                        <button
                                            onClick={() => handleEdit(habit)}
                                            className="btn btn-ghost btn-sm btn-icon"
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(habit.id)}
                                            className="btn btn-ghost btn-sm btn-icon"
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div style={styles.stats}>
                                    <div style={styles.statItem}>
                                        <div style={styles.statValue}>{stats.currentStreak}</div>
                                        <div className="text-sm text-secondary">Current Streak</div>
                                    </div>
                                    <div style={styles.statItem}>
                                        <div style={styles.statValue}>{stats.longestStreak}</div>
                                        <div className="text-sm text-secondary">Best Streak</div>
                                    </div>
                                    <div style={styles.statItem}>
                                        <div style={styles.statValue}>{stats.completionRate}%</div>
                                        <div className="text-sm text-secondary">Success Rate</div>
                                    </div>
                                </div>

                                {habit.goal && (
                                    <div style={styles.goal}>
                                        <span className="text-sm text-secondary">🎯 {habit.goal}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create/Edit Form Modal */}
            {showForm && (
                <div className="overlay" onClick={resetForm}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="mb-md">{editingHabit ? 'Edit Habit' : 'Create New Habit'}</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="label">Habit Name *</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="e.g., Morning Exercise"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">Icon</label>
                                <div style={styles.iconGrid}>
                                    {iconOptions.map(icon => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, icon })}
                                            style={{
                                                ...styles.iconButton,
                                                backgroundColor: formData.icon === icon ? 'var(--primary-100)' : 'transparent',
                                            }}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="label">Frequency</label>
                                <select
                                    className="select"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="Daily">Daily</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Custom">Custom</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="label">Goal (Optional)</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="e.g., Exercise 5 days a week"
                                    value={formData.goal}
                                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-sm justify-between">
                                <button type="button" onClick={resetForm} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingHabit ? 'Update Habit' : 'Create Habit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Templates Modal */}
            {showTemplates && (
                <div className="overlay" onClick={() => setShowTemplates(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="mb-md">Habit Templates</h2>
                        <p className="text-secondary mb-lg">Choose a template to get started quickly</p>

                        <div style={styles.templateGrid}>
                            {suggestions.map((template, index) => (
                                <div
                                    key={index}
                                    className="card"
                                    style={styles.templateCard}
                                    onClick={() => handleTemplateSelect(template)}
                                >
                                    <div style={styles.templateIcon}>{template.icon}</div>
                                    <h4 style={styles.templateName}>{template.name}</h4>
                                    <p className="text-sm text-secondary">{template.description}</p>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => setShowTemplates(false)} className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    emptyState: {
        textAlign: 'center',
        padding: '3rem 1rem',
    },
    emptyIcon: {
        fontSize: '4rem',
        marginBottom: '1rem',
    },
    habitCard: {
        transition: 'transform 0.2s',
    },
    habitIcon: {
        fontSize: '2rem',
    },
    habitName: {
        fontSize: '1.125rem',
        fontWeight: 600,
        margin: 0,
        marginBottom: '0.25rem',
    },
    stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-color)',
    },
    statItem: {
        textAlign: 'center',
    },
    statValue: {
        fontSize: '1.5rem',
        fontWeight: 700,
        color: 'var(--primary-600)',
    },
    goal: {
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-color)',
    },
    iconGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '0.5rem',
    },
    iconButton: {
        padding: '0.75rem',
        fontSize: '1.5rem',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    templateGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
    },
    templateCard: {
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.2s',
    },
    templateIcon: {
        fontSize: '2.5rem',
        marginBottom: '0.5rem',
    },
    templateName: {
        fontSize: '1rem',
        fontWeight: 600,
        marginBottom: '0.25rem',
    },
};

export default HabitsPage;
