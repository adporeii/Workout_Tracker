import React, { useRef, useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { Download, Upload, Settings as SettingsIcon, Trash2, Share2, Copy, Check } from 'lucide-react';

const SettingsPage = () => {
    const { history, testHistory, importData } = useWorkout();
    const fileInputRef = useRef(null);
    const [copySuccess, setCopySuccess] = useState(false);

    const getExportData = () => {
        return {
            history,
            testHistory,
            exportDate: new Date().toISOString(),
            version: 1
        };
    };

    const handleExport = async (forceShare = false) => {
        const data = getExportData();
        const fileName = `workout-backup-${new Date().toISOString().split('T')[0]}.json`;
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const file = new File([blob], fileName, { type: 'application/json' });

        // Try Native Share if requested
        if (forceShare) {
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: 'Workout Backup',
                        text: 'My workout history backup'
                    });
                    return;
                } catch (err) {
                    console.log('Share failed', err);
                    alert('Sharing failed or is not supported on this device. Try saving the file instead.');
                    return;
                }
            } else {
                alert('Sharing files is not supported on this browser/device.');
                return;
            }
        }

        // Standard download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleCopyToClipboard = async () => {
        const data = getExportData();
        try {
            await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            alert('Failed to copy to clipboard');
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.history && Array.isArray(data.history)) {
                    if (window.confirm('This will overwrite your current data. Are you sure?')) {
                        importData(data);
                        alert('Data imported successfully!');
                    }
                } else {
                    alert('Invalid file format.');
                }
            } catch (err) {
                alert('Error parsing JSON file.');
                console.error(err);
            }
        };
        reader.readAsText(file);
        e.target.value = null; // Reset input
    };

    return (
        <div className="settings-page">
            <header style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <SettingsIcon className="text-accent" size={32} />
                <h1 style={{ fontSize: '2rem', margin: 0 }}>Settings</h1>
            </header>

            <div className="card">
                <h3 style={{ marginBottom: '16px' }}>Data Management</h3>
                <p className="text-secondary" style={{ marginBottom: '24px' }}>
                    Backup your workout history or restore from a previous backup.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <button
                        className="btn-secondary"
                        onClick={() => handleExport(false)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        <Download size={20} /> Save Backup File
                    </button>

                    <button
                        className="btn-secondary"
                        onClick={() => handleExport(true)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        <Share2 size={20} /> Share to Socials
                    </button>

                    <button
                        className="btn-secondary"
                        onClick={handleCopyToClipboard}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid var(--text-secondary)' }}
                    >
                        {copySuccess ? <Check size={20} color="var(--accent-color)" /> : <Copy size={20} />}
                        {copySuccess ? 'Copied!' : 'Copy Data to Clipboard'}
                    </button>

                    <button
                        className="btn-secondary"
                        onClick={handleImportClick}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid var(--text-secondary)' }}
                    >
                        <Upload size={20} /> Import Data (JSON)
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".json"
                        style={{ display: 'none' }}
                    />
                </div>
            </div>

            <div className="card" style={{ marginTop: '24px', borderColor: 'rgba(255, 50, 50, 0.2)' }}>
                <h3 style={{ marginBottom: '16px', color: 'var(--danger-color)' }}>Danger Zone</h3>
                <button
                    className="btn-secondary"
                    onClick={() => {
                        if (window.confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
                            importData({ history: [], testHistory: [] });
                        }
                    }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        width: '100%',
                        borderColor: 'var(--danger-color)',
                        color: 'var(--danger-color)'
                    }}
                >
                    <Trash2 size={20} /> Clear All Data
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;
