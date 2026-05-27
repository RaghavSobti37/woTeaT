import React, { useState } from 'react';

export default function RegistrationFlow({ onComplete, onCancel }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    location: null
  });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: { lat: position.coords.latitude, lng: position.coords.longitude }
          }));
        },
        (err) => {
          console.warn("Location permission denied", err);
          alert("Please allow location access so we can deliver to you.");
        }
      );
    }
  };

  const requestLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to login');
      
      localStorage.setItem('woteat_token', data.token);
      
      const vector = data.user.tasteProfile?.vector;
      const persona = data.user.tasteProfile?.persona;
      
      if (vector && persona) {
        onComplete(vector, { title: persona }, data.user);
      } else {
        // Missing profile, needs onboarding
        if (typeof onRequireOnboarding === 'function') {
          onRequireOnboarding(data.user);
        } else {
          // Fallback if not passed
          onComplete(null, null, data.user);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    // Disabled logic for now
  };

  return (
    <div className="onboarding-container" style={{ marginTop: '1.5rem' }}>
      <div className="soviet-panel tilt-left" style={{ padding: '2.5rem 2rem', borderStyle: 'double', borderWidth: '8px' }}>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1rem', fontWeight: 'bold' }}>
          ← Back
        </button>

        <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--color-charcoal)', marginBottom: '0.5rem' }}>
          {isLogin ? 'Login to your account' : 'Create Your Account'}
        </h2>
        
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setIsLogin(true)} 
            style={{ flex: 1, padding: '0.5rem', background: isLogin ? 'var(--color-charcoal)' : '#ddd', color: isLogin ? 'white' : 'black', border: 'none', cursor: 'pointer' }}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)} 
            style={{ flex: 1, padding: '0.5rem', background: !isLogin ? 'var(--color-charcoal)' : '#ddd', color: !isLogin ? 'white' : 'black', border: 'none', cursor: 'pointer' }}
          >
            Register
          </button>
        </div>

        {error && <div style={{ color: 'var(--color-red)', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</div>}

        <form onSubmit={requestLogin}>
          {!isLogin && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Name</label>
                <input type="text" name="name" className="soviet-input" style={{ width: '100%' }} value={formData.name} onChange={handleInputChange} required />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email</label>
                <input type="email" name="email" className="soviet-input" style={{ width: '100%' }} value={formData.email} onChange={handleInputChange} required />
              </div>
            </>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Phone Number (for OTP)</label>
            <input type="tel" name="phone" className="soviet-input" style={{ width: '100%' }} value={formData.phone} onChange={handleInputChange} required />
          </div>

          {!isLogin && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Gender</label>
                <select name="gender" className="soviet-input" style={{ width: '100%' }} value={formData.gender} onChange={handleInputChange} required>
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Location</label>
                {formData.location ? (
                  <div style={{ color: 'var(--color-army-green)', fontWeight: 'bold' }}>✓ Location Captured</div>
                ) : (
                  <button type="button" className="soviet-btn btn-small" onClick={getLocation}>
                    Grant Location Access
                  </button>
                )}
              </div>
            </>
          )}

          <button type="submit" className="soviet-btn btn-red btn-block" disabled={loading || (!isLogin && !formData.location)}>
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
