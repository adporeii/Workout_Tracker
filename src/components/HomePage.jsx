import React from 'react';
import { format } from 'date-fns';
import { getWorkoutForDate } from '../data/schedule';
import { useWorkout } from '../context/WorkoutContext';

const HomePage = () => {
    const { startWorkout } = useWorkout();
    const today = new Date();
    const workoutType = getWorkoutForDate(today);

    const isRestDay = workoutType === 'Rest';

    return (
        <div className="home-page">
            <header style={{ marginBottom: '40px' }}>
                <div className="text-secondary">{format(today, 'EEEE, MMMM do')}</div>
                <h1 style={{ fontSize: '2.5rem', marginTop: '8px' }}>
                    {isRestDay ? 'Rest & Recover' : `Workout ${workoutType}`}
                </h1>
            </header>

            <div className="card">
                <h3 className="text-accent">Today's Focus</h3>
                {isRestDay ? (
                    <p className="text-secondary">
                        Take it easy today. Your muscles grow while you rest.
                    </p>
                ) : (
                    <p className="text-secondary">
                        {workoutType === 'A' ? 'Legs, Chest, Back & Arms' : 'Legs, Chest, Back & Arms (Variation)'}
                    </p>
                )}
            </div>

            {!isRestDay && (
                <button
                    className="btn-primary"
                    onClick={() => startWorkout(workoutType)}
                >
                    Start Workout
                </button>
            )}

            {isRestDay && (
                <div style={{ textAlign: 'center', marginTop: '40px', opacity: 0.5 }}>
                    See you on the next active day!
                </div>
            )}
        </div>
    );
};

export default HomePage;
