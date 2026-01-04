import React, { useState } from 'react';
import { useHabit } from '../context/HabitContext';

const ProfileSetup = ({ onComplete }) => {
    const { updateUserProfile } = useHabit();
    const [formData, setFormData] = useState({
        name: '',
        routine: 'Flexible',
        focus: 'Productivity',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUserProfile(formData);
        onComplete();
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="overlay">
            <div className="modal fade-in">
                <h2 className="mb-md">Welcome to Your Habit Tracker! 🎯</h2>
                <p className="text-secondary mb-lg">
                    Let's personalize your experience to help you build better habits.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label">Your Name (Optional)</label>
                        <input
                            type="text"
                            name="name"
                            className="input"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="label">Daily Routine Preference</label>
                        <select
                            name="routine"
                            className="select"
                            value={formData.routine}
                            onChange={handleChange}
                        >
                            <option value="Morning">Morning Person 🌅</option>
                            <option value="Flexible">Flexible Schedule ⏰</option>
                            <option value="Night">Night Owl 🌙</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="label">Primary Focus Goal</label>
                        <select
                            name="focus"
                            className="select"
                            value={formData.focus}
                            onChange={handleChange}
                        >
                            <option value="Productivity">Productivity 🚀</option>
                            <option value="Health">Health & Fitness 💪</option>
                            <option value="Learning">Learning & Growth 📚</option>
                            <option value="Self-care">Self-care & Wellness 🧘</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                        Get Started
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileSetup;
