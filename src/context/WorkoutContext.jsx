import React, { createContext, useContext, useState, useEffect } from 'react';



const WorkoutContext = createContext();

export const useWorkout = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('workout_history');
        return saved ? JSON.parse(saved) : [];
    });

    const [testHistory, setTestHistory] = useState(() => {
        const saved = localStorage.getItem('test_workout_history');
        return saved ? JSON.parse(saved) : [];
    });

    const [activeWorkout, setActiveWorkout] = useState(null); // { type: 'A' | 'B', startTime: Date, logs: {}, isTest: boolean }

    useEffect(() => {
        localStorage.setItem('workout_history', JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        localStorage.setItem('test_workout_history', JSON.stringify(testHistory));
    }, [testHistory]);

    const startWorkout = (type, isTest = false) => {
        setActiveWorkout({
            type,
            startTime: new Date().toISOString(),
            logs: {}, // { exerciseId: { weight: 0, reps: 0 } }
            isTest
        });
    };

    const finishWorkout = () => {
        if (!activeWorkout) return;
        const completedWorkout = {
            ...activeWorkout,
            endTime: new Date().toISOString(),
        };

        if (activeWorkout.isTest) {
            setTestHistory([completedWorkout, ...testHistory]);
        } else {
            setHistory([completedWorkout, ...history]);
        }

        setActiveWorkout(null);
    };

    const updateLog = (exerciseId, field, value) => {
        setActiveWorkout(prev => ({
            ...prev,
            logs: {
                ...prev.logs,
                [exerciseId]: {
                    ...prev.logs[exerciseId],
                    [field]: value
                }
            }
        }));
    };

    const getLastLog = (exerciseId, isTestContext = false) => {
        const targetHistory = isTestContext ? testHistory : history;
        // Search history for the most recent entry of this exercise
        for (const workout of targetHistory) {
            if (workout.logs && workout.logs[exerciseId]) {
                return workout.logs[exerciseId];
            }
        }
        return null;
    };

    const addManualWorkout = (data, isTest = false) => {
        const newWorkout = {
            type: 'Manual',
            startTime: data.date, // ISO string expected
            endTime: data.date,
            logs: {
                [data.exerciseId]: {
                    weight: data.weight,
                    reps: data.reps
                }
            },
            isTest
        };

        if (isTest) {
            setTestHistory(prev => [newWorkout, ...prev].sort((a, b) => new Date(b.startTime) - new Date(a.startTime)));
        } else {
            setHistory(prev => [newWorkout, ...prev].sort((a, b) => new Date(b.startTime) - new Date(a.startTime)));
        }
    };

    const importData = (data) => {
        if (data.history) setHistory(data.history);
        if (data.testHistory) setTestHistory(data.testHistory);
    };

    return (
        <WorkoutContext.Provider value={{
            history,
            testHistory,
            activeWorkout,
            startWorkout,
            finishWorkout,
            updateLog,
            getLastLog,
            addManualWorkout,
            importData,
            cancelWorkout: () => setActiveWorkout(null)
        }}>
            {children}
        </WorkoutContext.Provider>
    );
};
