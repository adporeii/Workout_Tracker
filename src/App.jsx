import React, { useState } from 'react';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import WorkoutPage from './components/WorkoutPage';
import HistoryPage from './components/HistoryPage';
import TestPage from './components/TestPage';
import ChartPage from './components/ChartPage';
import { useWorkout } from './context/WorkoutContext';

import SettingsPage from './components/SettingsPage';

function App() {
  const [page, setPage] = useState('home'); // 'home' | 'history' | 'test' | 'chart' | 'settings'
  const { activeWorkout } = useWorkout();

  // If there is an active workout, force show the WorkoutPage
  if (activeWorkout) {
    return (
      <Layout currentPage="workout" onNavigate={() => { }}>
        <WorkoutPage />
      </Layout>
    );
  }

  return (
    <Layout currentPage={page} onNavigate={setPage}>
      {page === 'home' && <HomePage />}
      {page === 'history' && <HistoryPage />}
      {page === 'test' && <TestPage />}
      {page === 'test-chart' && <ChartPage isTest={true} />}
      {page === 'chart' && <ChartPage />}
      {page === 'settings' && <SettingsPage />}
    </Layout>
  );
}

export default App;
