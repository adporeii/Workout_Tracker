import React, { useState, useMemo } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { WORKOUT_A, WORKOUT_B } from '../data/workouts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { TrendingUp, Plus, X } from 'lucide-react';

const ChartPage = ({ isTest = false }) => {
    const { history, testHistory, addManualWorkout } = useWorkout();
    const dataParams = isTest ? testHistory : history;

    // Combine all exercises for the dropdown
    const allExercises = useMemo(() => {
        const unique = new Map();
        [...WORKOUT_A, ...WORKOUT_B].forEach(ex => {
            unique.set(ex.id, ex.name);
        });
        return Array.from(unique.entries()).map(([id, name]) => ({ id, name }));
    }, []);

    const [selectedExerciseId, setSelectedExerciseId] = useState(allExercises[0]?.id || '');
    const [showModal, setShowModal] = useState(false);
    const [manualData, setManualData] = useState({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        reps: ''
    });

    // Process data for the chart
    const chartData = useMemo(() => {
        if (!selectedExerciseId) return [];

        const data = dataParams
            .filter(workout => workout.logs && workout.logs[selectedExerciseId])
            .map(workout => {
                const log = workout.logs[selectedExerciseId];
                return {
                    date: workout.startTime, // Keep ISO for sorting
                    displayDate: format(parseISO(workout.startTime), 'MMM d'),
                    weight: parseFloat(log.weight) || 0,
                    reps: parseFloat(log.reps) || 0,
                };
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        return data;
    }, [dataParams, selectedExerciseId]);

    const handleAddManual = (e) => {
        e.preventDefault();
        if (!manualData.weight || !manualData.reps) return;

        addManualWorkout({
            date: new Date(manualData.date).toISOString(),
            exerciseId: selectedExerciseId,
            weight: manualData.weight,
            reps: manualData.reps
        }, isTest);

        setShowModal(false);
        setManualData(prev => ({ ...prev, weight: '', reps: '' }));
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: 'var(--card-bg)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '12px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                }}>
                    <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: 'var(--text-secondary)' }}>{payload[0].payload.displayDate}</p>
                    <p style={{ margin: '0', color: 'var(--accent-color)' }}>
                        Weight: {payload[0].value} kg
                    </p>
                    <p style={{ margin: '4px 0 0 0', color: '#fff' }}>
                        Reps: {payload[0].payload.reps}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="chart-page">
            <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <TrendingUp className="text-accent" size={32} />
                        <h1 style={{ fontSize: '2rem', margin: 0 }}>{isTest ? 'Test Progress' : 'Progress'}</h1>
                    </div>
                    <p className="text-secondary">{isTest ? 'Analyze your experimental data.' : 'Track your strength gains over time.'}</p>
                </div>
                <button
                    className="btn-secondary"
                    onClick={() => setShowModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
                >
                    <Plus size={18} /> Add Data
                </button>
            </header>

            <div className="card">
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Select Exercise
                </label>
                <select
                    value={selectedExerciseId}
                    onChange={(e) => setSelectedExerciseId(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        outline: 'none'
                    }}
                >
                    {allExercises.map(ex => (
                        <option key={ex.id} value={ex.id}>
                            {ex.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="card" style={{ height: '400px', padding: '20px 10px 20px 0' }}>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis
                                dataKey="displayDate"
                                stroke="var(--text-secondary)"
                                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="var(--text-secondary)"
                                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                domain={['dataMin - 5', 'dataMax + 5']}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
                            <Line
                                type="monotone"
                                dataKey="weight"
                                stroke="var(--accent-color)"
                                strokeWidth={3}
                                dot={{ fill: 'var(--bg-color)', stroke: 'var(--accent-color)', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, fill: 'var(--accent-color)' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        No data available for this exercise yet.
                    </div>
                )}
            </div>

            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'var(--card-bg)',
                        padding: '24px',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '400px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0 }}>Add Manual Entry</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', color: 'var(--text-secondary)', padding: 0 }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAddManual}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    Exercise
                                </label>
                                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: 'var(--text-secondary)' }}>
                                    {allExercises.find(e => e.id === selectedExerciseId)?.name}
                                </div>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={manualData.date}
                                    onChange={e => setManualData({ ...manualData, date: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        Weight (kg)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="0"
                                        step="0.5"
                                        value={manualData.weight}
                                        onChange={e => setManualData({ ...manualData, weight: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: 'var(--text-primary)',
                                            fontSize: '1rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        Reps
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="0"
                                        value={manualData.reps}
                                        onChange={e => setManualData({ ...manualData, reps: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: 'var(--text-primary)',
                                            fontSize: '1rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                                Save Entry
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChartPage;
