# Workout Tracker

A modern, mobile-friendly workout tracker designed for strength training with an A/B split schedule. Built with React and Vite, this application helps you track your progressive overload, visualize your progress, and manage your workout history.

## Features

-   **Smart Scheduling**: Automatically determines your workout (A or B) based on the day of the week.
-   **Workout Logging**: Easy-to-use interface for logging sets, reps, and weight.
-   **Rest Timer**: Built-in timer to track rest periods between sets.
-   **Progress Visualization**: Interactive charts to track your strength gains over time.
-   **History View**: Detailed log of all your past workouts.
-   **Data Management**: Export and import your workout data (JSON) for backup.
-   **Test Mode**: A dedicated sandbox environment to test features without affecting your actual workout data.
-   **PWA Support**: Installable as an app on mobile devices.

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or higher recommended)
-   npm (comes with Node.js)

### Installation

1.  **Download the project**:
    Download the source code and extract it to a folder.

2.  **Install dependencies**:
    Open a terminal in the project folder and run:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the app**:
    The terminal will show a local URL (usually `http://localhost:5173`). Open this in your browser.

## How to Use

### 1. Starting a Workout
-   On the **Home** screen, you will see the scheduled workout for the day (Workout A, Workout B, or Rest).
-   Click **"Start Workout"** to begin.
-   If it's a Rest day, you can still choose to start a workout manually if needed.

### 2. Logging Sets
-   Enter the **Weight (kg)** and **Reps** for each set.
-   Check the box next to the set to mark it as complete.
-   **Rest Timer**: Click the clock icon next to a set to start a rest timer. You can adjust the duration in Settings.

### 3. Viewing Progress
-   **History Tab**: View a list of all your completed workouts. Click on a workout to see details.
-   **Charts Tab**: Select an exercise to see a graph of your estimated 1RM (One Rep Max) or max weight over time.

### 4. Data Backup
-   Go to the **Settings** tab.
-   Click **"Export Data"** to download a JSON file of your history.
-   Use **"Import Data"** to restore from a backup.

### 5. Test Mode
-   Navigate to the **Test** tab to enter the sandbox.
-   Here you can create test workouts and generate dummy data.
-   This data is isolated and will **not** appear in your main History or Charts.

## Deployment (Optional)

### Deploy Web App to Vercel
1.  Create a free account at [vercel.com](https://vercel.com)
2.  Install Vercel CLI: `npm install -g vercel`
3.  Run `vercel` in the project folder and follow the prompts
4.  Your app will be live at the provided URL

### Deploy Mobile App with Expo
The `mobile` folder contains an Expo-based mobile version.

1.  Navigate to the mobile folder: `cd mobile`
2.  Install dependencies: `npm install`
3.  Install Expo CLI: `npm install -g expo-cli`
4.  Start the app: `npx expo start`
5.  Scan the QR code with the Expo Go app ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

For building standalone apps, see the [Expo documentation](https://docs.expo.dev/build/setup/).
