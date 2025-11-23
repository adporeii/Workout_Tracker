import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

const RestTimer = () => {
    const [timeLeft, setTimeLeft] = useState(90); // Default 90s
    const [isActive, setIsActive] = useState(false);
    const [initialTime, setInitialTime] = useState(90);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            // Optional: Play sound here
        }

        return () => clearInterval(intervalRef.current);
    }, [isActive, timeLeft]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(initialTime);
    };

    const adjustTime = (seconds) => {
        const newTime = Math.max(0, timeLeft + seconds);
        setTimeLeft(newTime);
        if (!isActive) setInitialTime(newTime);
    };

    const setPreset = (seconds) => {
        setIsActive(false);
        setTimeLeft(seconds);
        setInitialTime(seconds);
        setIsActive(true);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '80px', // Above the nav bar
            right: '16px',
            background: 'var(--card-bg)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            zIndex: 50,
            width: '160px'
        }}>
            <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                fontVariantNumeric: 'tabular-nums',
                color: timeLeft === 0 ? 'var(--accent-color)' : 'var(--text-primary)'
            }}>
                {formatTime(timeLeft)}
            </div>

            <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'center' }}>
                <button
                    onClick={toggleTimer}
                    className="btn-primary"
                    style={{ padding: '8px', flex: 1, display: 'flex', justifyContent: 'center' }}
                >
                    {isActive ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button
                    onClick={resetTimer}
                    className="btn-secondary"
                    style={{ padding: '8px', flex: 0, display: 'flex', justifyContent: 'center' }}
                >
                    <RotateCcw size={20} />
                </button>
            </div>

            <div style={{ display: 'flex', gap: '4px', width: '100%', justifyContent: 'space-between' }}>
                <button onClick={() => adjustTime(-10)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '4px', padding: '4px 8px' }}>-10</button>
                <button onClick={() => adjustTime(10)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '4px', padding: '4px 8px' }}>+10</button>
            </div>

            <div style={{ display: 'flex', gap: '4px', width: '100%', marginTop: '4px' }}>
                <button onClick={() => setPreset(60)} style={{ flex: 1, fontSize: '0.7rem', background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', borderRadius: '4px', padding: '4px' }}>60s</button>
                <button onClick={() => setPreset(90)} style={{ flex: 1, fontSize: '0.7rem', background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', borderRadius: '4px', padding: '4px' }}>90s</button>
                <button onClick={() => setPreset(120)} style={{ flex: 1, fontSize: '0.7rem', background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', borderRadius: '4px', padding: '4px' }}>2m</button>
            </div>
        </div>
    );
};

export default RestTimer;
