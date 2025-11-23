import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { format, parseISO } from 'date-fns';
import { ChevronDown, ChevronUp, Beaker } from 'lucide-react';
import { WORKOUT_A, WORKOUT_B } from '../data/workouts';

const TestPage = () => {
    const { startWorkout, testHistory = [] } = useWorkout();
    const [expandedId, setExpandedId] = useState(null);

    const toggleExpand = (startTime) => {
        setExpandedId(expandedId === startTime ? null : startTime);
    };

    const getExerciseName = (id) => {
        const all = [...WORKOUT_A, ...WORKOUT_B];
        const found = all.find(e => e.id === id);
        return found ? found.name : id;
    };

    return (
        <div className="test-page">
            <header style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <Beaker className="text-accent" size={32} />
                    <h1 style={{ fontSize: '2rem', margin: 0 }}>Test Lab</h1>
                </div>
                <p className="text-secondary">
                    Experiment with workouts without affecting your real data.
                    No schedule restrictions here.
                </p>
            </header>

            <div className="card">
                <h3 className="text-accent">Force Start</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <button
                        className="btn-secondary"
                        onClick={() => startWorkout('A', true)}
                        style={{ border: '1px solid var(--accent-color)', color: 'var(--accent-color)' }}
                    >
                        Workout A
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => startWorkout('B', true)}
                        style={{ border: '1px solid var(--accent-color)', color: 'var(--accent-color)' }}
                    >
                        Workout B
                    </button>
                </div>
            </div>

            <h3 style={{ marginTop: '32px', marginBottom: '16px' }}>Test History</h3>

            {testHistory.length === 0 ? (
                <div className="text-secondary" style={{ fontStyle: 'italic' }}>No test runs recorded yet.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {testHistory.map((workout) => {
                        const isExpanded = expandedId === workout.startTime;
                        const date = parseISO(workout.startTime);

                        return (
                            <div key={workout.startTime} className="card" style={{ padding: '0' }}>
                                <div
                                    onClick={() => toggleExpand(workout.startTime)}
                                    style={{
                                        padding: '20px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                            {format(date, 'MMM do, HH:mm')}
                                        </div>
                                        <div className="text-accent">Test Run: Workout {workout.type}</div>
                                    </div>
                                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>

                                {isExpanded && (
                                    <div style={{
                                        padding: '0 20px 20px 20px',
                                        borderTop: '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {Object.entries(workout.logs).map(([exId, data]) => (
                                                <div key={exId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                                    <span className="text-secondary">{getExerciseName(exId)}</span>
                                                    <span style={{ fontWeight: 'bold' }}>{data.weight}kg × {data.reps}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TestPage;
