import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import { setAuthToken } from './services/api';
import './App.css';

const VALID_TABS = ['home', 'about', 'login', 'signup', 'dashboard'];

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('ayurveda_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const getInitialTab = () => {
    try {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (VALID_TABS.includes(hash)) return hash;

      const savedTab = localStorage.getItem('ayurveda_active_tab');
      if (savedTab && VALID_TABS.includes(savedTab)) return savedTab;

      const savedUser = localStorage.getItem('ayurveda_user');
      if (savedUser) return 'dashboard';

      return 'home';
    } catch (e) {
      return 'home';
    }
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    try {
      localStorage.setItem('ayurveda_active_tab', tab);
      if (window.location.hash !== `#${tab}`) {
        window.location.hash = tab;
      }
    } catch (e) {
      console.warn('Failed to save active tab state:', e);
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (VALID_TABS.includes(hash)) {
        setActiveTabState(hash);
        localStorage.setItem('ayurveda_active_tab', hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    if (!window.location.hash && activeTab) {
      window.location.hash = activeTab;
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('ayurveda_user');
    localStorage.removeItem('ayurveda_active_tab');
    setUser(null);
    setActiveTab('login');
  };

  return (
    <div className="app-root">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout} 
      />
      
      <main className="main-content">
        {activeTab === 'home' && <Home setActiveTab={setActiveTab} user={user} />}
        {activeTab === 'about' && <About setActiveTab={setActiveTab} />}
        {activeTab === 'login' && <Login setActiveTab={setActiveTab} setUser={setUser} />}
        {activeTab === 'signup' && <SignUp setActiveTab={setActiveTab} setUser={setUser} />}
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} user={user} onLogout={handleLogout} />}
      </main>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
