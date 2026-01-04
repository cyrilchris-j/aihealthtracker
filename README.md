# 🎯 Personal Habit Tracker

A beautiful, full-featured habit tracking web application built with React and Vite. Track your daily habits, visualize your progress, and get AI-powered insights to build better routines—all without any login or authentication required!

## ✨ Features

- **📊 Dashboard**: Track today's habits with real-time progress visualization
- **✅ Habit Management**: Create, edit, and delete custom habits with icons
- **📈 Analytics**: Beautiful charts showing completion trends and patterns
- **🤖 AI Insights**: Personalized habit analysis and motivational messages
- **🔥 Streak Tracking**: Monitor current and longest streaks for each habit
- **🌓 Dark Mode**: Toggle between light and dark themes
- **💾 Data Export/Import**: Backup and restore your habit data
- **🔔 Notifications**: Browser notifications for habit reminders
- **📱 Responsive**: Works perfectly on mobile, tablet, and desktop

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone or navigate to the project directory:
```bash
cd c:\Users\DELL\Desktop\ai
```

2. Install dependencies (already done):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit: `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📖 How to Use

### First Time Setup
1. Enter your name (optional)
2. Select your daily routine preference
3. Choose your primary focus goal
4. Click "Get Started"

### Creating Habits
1. Go to "My Habits" page
2. Click "+ New Habit" or browse templates
3. Customize your habit with name, icon, and frequency
4. Save and start tracking!

### Daily Tracking
1. Visit the Dashboard
2. Check off completed habits
3. Add notes to track your thoughts
4. Watch your streaks grow!

### Viewing Progress
- **Analytics**: See completion trends over 7, 14, or 30 days
- **AI Insights**: Get personalized feedback and recommendations
- **Dashboard**: Monitor today's progress at a glance

## 🎨 Design Philosophy

- **Modern & Minimal**: Clean interface that doesn't distract
- **Productivity Colors**: Soft blues and greens for focus
- **Smooth Animations**: Delightful micro-interactions
- **Mobile-First**: Optimized for all screen sizes

## 🔧 Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Vanilla CSS with CSS Variables
- **State Management**: React Context API
- **Storage**: localStorage (client-side)
- **Icons**: Emoji (no external dependencies)

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.jsx
│   ├── HabitsPage.jsx
│   ├── AnalyticsPage.jsx
│   ├── InsightsPage.jsx
│   ├── SettingsPage.jsx
│   ├── Navigation.jsx
│   └── ProfileSetup.jsx
├── context/            # React Context
│   └── HabitContext.jsx
├── utils/              # Utility functions
│   ├── storage.js
│   ├── dateHelpers.js
│   ├── aiInsights.js
│   └── notifications.js
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## 💡 Features in Detail

### Habit Types
- **Daily**: Track every day
- **Weekly**: Track specific days
- **Custom**: Set your own frequency

### AI Insights (Simulated)
- Daily motivational messages
- Weekly habit summaries
- Pattern analysis and recommendations
- Personalized based on your profile

### Data Management
- **Export**: Download JSON backup
- **Import**: Restore from backup
- **Reset**: Clear all data (with confirmation)

## 🌟 What Makes This Special

✅ **No Login Required**: All data stored locally in your browser  
✅ **Privacy First**: Your data never leaves your device  
✅ **Offline Ready**: Works without internet connection  
✅ **Fast & Lightweight**: Minimal dependencies, instant load  
✅ **Beautiful UI**: Professional design with smooth animations  
✅ **Fully Responsive**: Perfect on any device  

## 🎯 Future Enhancements

- Real AI integration with OpenAI API
- Calendar heatmap view
- Achievement badges and milestones
- Cloud sync option
- Advanced analytics and reports
- Social sharing features

## 📄 License

This project is open source and available for personal use.

## 🤝 Contributing

Feel free to fork, modify, and enhance this project!

---

**Built with ❤️ to help you build better habits**

🎯 Start tracking your habits today at `http://localhost:5173`
