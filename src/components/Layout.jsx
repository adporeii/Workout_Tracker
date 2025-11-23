import React from 'react';
import { Home, History, Beaker, TrendingUp, Settings } from 'lucide-react';

const Layout = ({ children, currentPage, onNavigate }) => {
    return (
        <div className="layout">
            <div className="container animate-fade-in">
                {children}
            </div>

            <nav style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(22, 22, 22, 0.9)',
                backdropFilter: 'blur(10px)',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-around',
                padding: '16px 16px max(16px, env(safe-area-inset-bottom)) 16px',
                zIndex: 100
            }}>
                <button
                    onClick={() => onNavigate('home')}
                    style={{ color: currentPage === 'home' ? 'var(--accent-color)' : 'var(--text-secondary)', background: 'none' }}
                >
                    <Home size={24} />
                    <div style={{ fontSize: '0.7rem', marginTop: '4px' }}>Home</div>
                </button>
                <button
                    onClick={() => onNavigate('history')}
                    style={{ color: currentPage === 'history' ? 'var(--accent-color)' : 'var(--text-secondary)', background: 'none' }}
                >
                    <History size={24} />
                    <div style={{ fontSize: '0.7rem', marginTop: '4px' }}>History</div>
                </button>
                <button
                    onClick={() => onNavigate('chart')}
                    style={{ color: currentPage === 'chart' ? 'var(--accent-color)' : 'var(--text-secondary)', background: 'none' }}
                >
                    <TrendingUp size={24} />
                    <div style={{ fontSize: '0.7rem', marginTop: '4px' }}>Progress</div>
                </button>
                <button
                    onClick={() => onNavigate('settings')}
                    style={{ color: currentPage === 'settings' ? 'var(--accent-color)' : 'var(--text-secondary)', background: 'none' }}
                >
                    <Settings size={24} />
                    <div style={{ fontSize: '0.7rem', marginTop: '4px' }}>Settings</div>
                </button>
                {/* 
        <button 
          onClick={() => onNavigate('test')}
          style={{ color: currentPage === 'test' ? 'var(--accent-color)' : 'var(--text-secondary)', background: 'none' }}
        >
          <Beaker size={24} />
          <div style={{fontSize: '0.7rem', marginTop: '4px'}}>Test</div>
        </button>
        <button 
          onClick={() => onNavigate('test-chart')}
          style={{ color: currentPage === 'test-chart' ? 'var(--accent-color)' : 'var(--text-secondary)', background: 'none' }}
        >
          <TrendingUp size={24} />
          <div style={{fontSize: '0.7rem', marginTop: '4px'}}>Test Graph</div>
        </button> 
        */}
            </nav>
        </div>
    );
};

export default Layout;
