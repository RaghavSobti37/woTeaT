import React, { useState } from 'react';
import { SovietStar } from './Graphics';
import RegistrationFlow from './RegistrationFlow';

export default function Home({ onStartJourney, onLoginProfile }) {
  const [showRegistration, setShowRegistration] = useState(false);

  if (showRegistration) {
    return <RegistrationFlow onComplete={onLoginProfile} onCancel={() => setShowRegistration(false)} />;
  }

  return (
    <div className="onboarding-container" style={{ marginTop: '1.5rem' }}>
      <div className="soviet-panel tilt-left" style={{ padding: '2.5rem 2rem', borderStyle: 'double', borderWidth: '8px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <SovietStar width="80" height="80" style={{ transform: 'rotate(-5deg)' }} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'var(--color-charcoal)', borderTop: '4px solid var(--color-charcoal)', borderBottom: '4px solid var(--color-charcoal)', display: 'inline-block', padding: '0.25rem 2rem', letterSpacing: '0.1em' }}>
            WOTEAT
          </h2>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-red)', marginBottom: '0.75rem' }}>
            Skip the scrolling. Let us order the food.
          </h3>
          <p style={{ fontSize: '1rem', color: '#333', lineHeight: '1.5' }}>
            Tell us what you love, set your budget, and we’ll send you the perfect meal right when you're hungry.
          </p>
        </div>

        <div className="soviet-line-heavy" style={{ height: '6px' }}></div>

        <div style={{ margin: '1.5rem 0' }}>
          <button className="soviet-btn btn-red btn-block" style={{ fontSize: '1.25rem' }} onClick={() => setShowRegistration(true)}>
            ★ GET STARTED ★
          </button>
        </div>

        <div className="soviet-line-heavy" style={{ margin: '2rem 0 0.5rem 0' }}></div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#666' }}>
          <span>Nashik</span>
          <span>ONLINE</span>
        </div>

      </div>
    </div>
  );
}
