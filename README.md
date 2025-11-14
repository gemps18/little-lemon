# 📱 Little Lemon — React Native Capstone App

- A fully functional mobile app built using React Native, Expo, and SQLite as part of the Meta React Native Specialization.
- The app simulates a restaurant ordering experience with onboarding, profile management, filtering, searching, and local data persistence.

## 🚀 Features
### 👋 Onboarding Flow

- First-time users complete a profile form

- Data is saved locally via AsyncStorage

- Returning users skip onboarding automatically

### 🏠 Home Screen

- Displays restaurant hero section

- Dynamic category filters (Starters, Mains, Desserts)

- Search bar with debounced search

- Menu data loaded from remote JSON, stored in SQLite, and displayed offline

- Local images for all dishes for fast and consistent rendering

### 👤 Profile Management

- View and edit saved profile info

- Upload/replace profile avatar

- Toggle preferences (newsletter, notifications, etc.)

- Data saved locally with AsyncStorage

- Logout resets the onboarding state

### 📦 Local Data Storage

- SQLite table initialized on first launch

- Menu items fetched once from API → stored in database

- Filtering and searching performed directly on local DB (offline-friendly)

### 🎨 Custom Styling & Fonts

- Uses Karla & MarkaziText fonts

- Clean, modern UI

- Consistent color scheme from Meta course specification

## 🛠 Tech Stack

- React Native

- Expo

- React Navigation

- SQLite (expo-sqlite)

- AsyncStorage

- Lodash (debounce)

- React Native Paper

- Custom Fonts via Expo

## ▶️ Getting Started
1. Install dependencies
- npm install

2. Start the Expo development server
- npx expo start

3. Open the app

- You can open it using any of the following:

- Expo Go (Android/iOS physical devices)

- iOS Simulator (macOS only)

- Android Emulator

- Expo Development Build (recommended for full SQLite support)

## 🖼 Wireframe

![Wireframe](.little-lemon-wireframe.png)

## 🧪 Notes

- If you use Expo Go, SQLite requires the newer openDatabaseSync() API.

- Local images are used instead of remote URLs to prevent loading failures.

- Menu items are fetched once and stored in SQLite for offline performance.

## Author

- LinkedIn - [@gemps18] (https://www.linkedin.com/in/gemps18/)