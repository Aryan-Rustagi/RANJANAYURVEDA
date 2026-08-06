import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import { setAuthToken } from './services/api';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('ayurveda_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('ayurveda_user');
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
