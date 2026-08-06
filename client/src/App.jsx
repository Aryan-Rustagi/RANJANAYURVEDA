import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Admin from './components/Admin';
import Footer from './components/Footer';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="app-root">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        {activeTab === 'home' && <Home setActiveTab={setActiveTab} />}
        {activeTab === 'about' && <About setActiveTab={setActiveTab} />}
        {activeTab === 'login' && <Login setActiveTab={setActiveTab} />}
        {activeTab === 'signup' && <SignUp setActiveTab={setActiveTab} />}
        {activeTab === 'admin' && <Admin setActiveTab={setActiveTab} />}
      </main>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
