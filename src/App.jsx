import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Wallet from './components/Wallet';
import LocationScheduler from './components/LocationScheduler';
import QALab from './components/QALab';
import Analytics from './components/Analytics';
import { getWalletBalance, initLedger } from './utils/walletLedger';
import { SovietStar } from './components/Graphics';


export default function App() {
  const [userVector, setUserVector] = useState(null);
  const [userPersona, setUserPersona] = useState(null);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, logistics, wallet, qa, analytics
  const [walletBalance, setWalletBalance] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [isOnboarding, setIsOnboarding] = useState(false);

  // Toast notifier generator
  const addToast = ({ title, message, type = "info" }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    
    // Auto-remove toast
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  useEffect(() => {
    // 1. Initialize accounting ledger
    initLedger();
    setWalletBalance(getWalletBalance());
    
    // 2. Load flavor passport if exists
    const storedVector = localStorage.getItem("woteat_user_vector");
    const storedPersona = localStorage.getItem("woteat_user_persona");
    const storedUserData = localStorage.getItem("woteat_user_data");
    
    if (storedVector && storedPersona) {
      setUserVector(JSON.parse(storedVector));
      setUserPersona(JSON.parse(storedPersona));
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    }
  }, []);

  const handleOnboardingComplete = (vector, persona, userResponseData) => {
    setUserVector(vector);
    setUserPersona(persona);
    if (userResponseData) {
      setUserData(userResponseData);
      localStorage.setItem("woteat_user_data", JSON.stringify(userResponseData));
    }
    localStorage.setItem("woteat_user_vector", JSON.stringify(vector));
    localStorage.setItem("woteat_user_persona", JSON.stringify(persona));
    setWalletBalance(getWalletBalance());
    
    addToast({
      title: "PROFILE READY",
      message: `Your Matchmaker profile is ready! Promo balance ₹1,000 added to your Food Fund.`,
      type: "success"
    });
  };

  const handleRequireOnboarding = (userResponseData) => {
    setUserData(userResponseData);
    setIsOnboarding(true);
  };

  const handleResetProfile = () => {
    if (window.confirm("RESET FLAVOR PASSPORT AND RE-RUN ONBOARDING SURVEY?")) {
      localStorage.removeItem("woteat_user_vector");
      localStorage.removeItem("woteat_user_persona");
      localStorage.removeItem("woteat_user_data");
      setUserVector(null);
      setUserPersona(null);
      setUserData(null);
      setIsOnboarding(false);
      setActiveTab("dashboard");
      addToast({
        title: "PROFILE RESET",
        message: "Your profile has been cleared. Let's set it up again.",
        type: "info"
      });
    }
  };

  const handleUpdateWallet = () => {
    setWalletBalance(getWalletBalance());
  };

  if (!userVector) {
    return (
      <div className="app-container">
        <main>
          {isOnboarding ? (
            <Onboarding onComplete={handleOnboardingComplete} />
          ) : (
            <Home 
              onStartJourney={() => setIsOnboarding(true)} 
              onLoginProfile={handleOnboardingComplete} 
              onRequireOnboarding={handleRequireOnboarding}
            />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Premium Header */}
      <header className="app-header">
        <div className="logo-container">
          <SovietStar width="32" height="32" style={{ transform: 'rotate(-5deg)' }} />
          <div>
            <h1 className="logo-text">WoTeaT</h1>
            <p className="logo-sub">STATE MEAL SUBSCRIPTION SERVICE</p>
          </div>
        </div>

        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {userPersona && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', borderRight: '2px solid var(--border-color)', paddingRight: '1rem' }}>
              <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{userData?.name || 'Foodie'}</span>
              <span style={{ fontSize: '0.75rem', color: '#666' }}>{userPersona.title}</span>
            </div>
          )}
          <div className="wallet-badge">
            <span>MEAL BALANCE:</span>
            <strong style={{ color: walletBalance < 500 ? 'var(--color-red)' : 'inherit' }}>
              ₹{walletBalance.toLocaleString('en-IN')}
            </strong>
            <button className="wallet-badge-btn" onClick={() => setActiveTab("wallet")}>+</button>
          </div>
          
          <button className="soviet-btn btn-small" onClick={handleResetProfile}>
            USER SETTINGS
          </button>
        </div>
      </header>

      {/* Main Friendly Tabs */}
      <nav className="soviet-tabs">
        <button 
          className={`soviet-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab("dashboard")}
        >
          ★ DASHBOARD
        </button>
        <button 
          className={`soviet-tab ${activeTab === 'logistics' ? 'active' : ''}`}
          onClick={() => setActiveTab("logistics")}
        >
          ⚙️ MY DELIVERIES
        </button>
        <button 
          className={`soviet-tab ${activeTab === 'wallet' ? 'active' : ''}`}
          onClick={() => setActiveTab("wallet")}
        >
          ₹ FOOD FUND
        </button>
        {(userData?.phone === '+91 8591499393' || userData?.phone === '8591499393' || userData?.email === 'raghavsobti37@gmail.com') && (
          <>
            <button 
              className={`soviet-tab ${activeTab === 'qa' ? 'active' : ''}`}
              onClick={() => setActiveTab("qa")}
            >
              🎛️ QA LAB
            </button>
            <button 
              className={`soviet-tab ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab("analytics")}
            >
              📈 ANALYTICS
            </button>
          </>
        )}
      </nav>

      {/* Page Routing */}
      <main>
        {activeTab === "dashboard" && (
          <Dashboard 
            userVector={userVector} 
            userPersona={userPersona} 
            onAddToast={addToast} 
            onUpdateWallet={handleUpdateWallet} 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "logistics" && (
          <LocationScheduler onAddToast={addToast} />
        )}
        {activeTab === "wallet" && (
          <Wallet onUpdate={handleUpdateWallet} />
        )}
        {activeTab === "qa" && (
          <QALab onRefreshDashboard={handleUpdateWallet} />
        )}
        {activeTab === "analytics" && (
          <Analytics userVector={userVector} userPersona={userPersona} />
        )}
      </main>

      {/* Floating Notifications Toaster */}
      <div className="soviet-toast-container">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className="soviet-toast" 
            style={{ 
              borderColor: toast.type === 'warning' ? 'var(--color-red)' : toast.type === 'success' ? 'var(--color-army-green)' : 'var(--color-charcoal)',
              background: toast.type === 'warning' ? '#FDF3F3' : 'var(--color-paper-light)'
            }}
          >
            <div className="toast-header">
              <span className="toast-title" style={{ color: toast.type === 'success' ? 'var(--color-army-green)' : 'var(--color-red)' }}>
                {toast.title}
              </span>
              <button 
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-light)' }}>
              {toast.message}
            </p>
          </div>
        ))}
      </div>

      <footer style={{ marginTop: '3rem', padding: '1.5rem 0', borderTop: 'var(--border-thin)', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#666' }}>
        <span>UNION RATION COMMISSARIAT // DISTRICT NASHIK // ALL CODES SECURED</span>
      </footer>
    </div>
  );
}
