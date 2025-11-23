import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useWorkout } from '../context/WorkoutContext';
import { WORKOUT_A, WORKOUT_B } from '../data/workouts';
import { ChevronDown, ChevronUp } from 'lucide-react';

const HistoryPage = () => {
    const { history } = useWorkout();
    const [expandedId, setExpandedId] = useState(null);

    const toggleExpand = (startTime) => {
        setExpandedId(expandedId === startTime ? null : startTime);
    };

    const getExerciseName = (id) => {
        const all = [...WORKOUT_A, ...WORKOUT_B];
        const found = all.find(e => e.id === id);
        return found ? found.name : id;
    };

    if (history.length === 0) {
        return (
            <div style={{ textAlign: 'center', marginTop: '60px' }}>
                <h2 className="text-secondary">No history yet</h2>
                <p className="text-secondary">Complete your first workout to see it here.</p>
            </div>
        );
    }

    return (
        <div className="history-page">
            <h2>Workout History</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {history.map((workout) => {
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
                                        {format(date, 'MMM do, yyyy')}
                                    </div>
                                    <div className="text-accent">Workout {workout.type}</div>
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
        </div>
    );
};

export default HistoryPage;
