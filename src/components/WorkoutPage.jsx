import React from 'react';
import { WORKOUT_A, WORKOUT_B } from '../data/workouts';
import { useWorkout } from '../context/WorkoutContext';

import RestTimer from './RestTimer';

const WorkoutPage = () => {
    const { activeWorkout, finishWorkout, updateLog, getLastLog, cancelWorkout } = useWorkout();

    const exercises = activeWorkout.type === 'A' ? WORKOUT_A : WORKOUT_B;
    const isTest = activeWorkout.isTest;

    return (
        <div className="workout-page" style={{ paddingBottom: '160px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ marginBottom: 0 }}>Workout {activeWorkout.type}</h2>
                    {isTest && <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '1px' }}>Test Mode</span>}
                </div>
                <button
                    onClick={cancelWorkout}
                    style={{ color: 'var(--danger-color)', background: 'none', fontSize: '0.9rem' }}
                >
                    Cancel
                </button>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {exercises.map((exercise) => {
                    const lastLog = getLastLog(exercise.id, isTest);
                    const currentLog = activeWorkout.logs[exercise.id] || {};

                    return (
                        <div key={exercise.id} className="card">
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{exercise.name}</h3>
                            <div className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '16px' }}>
                                Target: {exercise.sets} sets × {exercise.repRange} reps
                            </div>

                            {lastLog && (
                                <div style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    marginBottom: '16px',
                                    fontSize: '0.85rem',
                                    color: 'var(--accent-color)'
                                }}>
                                    Last: {lastLog.weight}kg × {lastLog.reps} reps
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>Weight (kg)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={currentLog.weight || ''}
                                        onChange={(e) => updateLog(exercise.id, 'weight', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>Reps</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={currentLog.reps || ''}
                                        onChange={(e) => updateLog(exercise.id, 'reps', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: '32px' }}>
                <button className="btn-primary" onClick={finishWorkout}>
                    Finish Workout
                </button>
            </div>

            {/* <RestTimer /> */}
        </div>
    );
};

export default WorkoutPage;
