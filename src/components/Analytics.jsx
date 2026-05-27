import React from 'react';

export default function Analytics({ userVector, userPersona }) {
  // Mock data for analytics visualization based on the current user vector
  const metrics = [
    { label: "Spice Tolerance", value: (userVector[0] * 100).toFixed(1) },
    { label: "Sweetness Affinity", value: (userVector[1] * 100).toFixed(1) },
    { label: "Carb Heaviness", value: (userVector[2] * 100).toFixed(1) },
    { label: "Grease/Oil Level", value: (userVector[3] * 100).toFixed(1) },
    { label: "Exploration Rate", value: (userVector[4] * 100).toFixed(1) }
  ];

  return (
    <div className="soviet-panel tilt-right" style={{ padding: '2rem' }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-charcoal)', borderBottom: '2px solid var(--color-charcoal)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
        📈 SYSTEM ANALYTICS & MACHINE LEARNING
      </h2>

      <div style={{ background: '#F2EFE9', padding: '1.5rem', border: '1px solid var(--color-charcoal)', marginBottom: '1.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--color-red)', marginBottom: '1rem' }}>
          USER VECTOR RECALIBRATION: COMRADE
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {metrics.map((m, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span>{m.label}</span>
                <strong>{m.value}%</strong>
              </div>
              <div style={{ height: '12px', background: 'var(--color-cardboard)', border: '1px solid var(--color-charcoal)', width: '100%' }}>
                <div style={{ height: '100%', width: `${m.value}%`, background: 'var(--color-red)' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ border: '2px dashed var(--color-charcoal)', padding: '1.5rem', textAlign: 'center' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem' }}>CONFIDENCE SCORE</h4>
          <p style={{ fontSize: '2.5rem', color: 'var(--color-army-green)', fontWeight: 'bold', margin: '0.5rem 0' }}>87%</p>
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Model convergence rate</p>
        </div>
        
        <div style={{ border: '2px dashed var(--color-charcoal)', padding: '1.5rem', textAlign: 'center' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem' }}>CURRENT PERSONA</h4>
          <p style={{ fontSize: '1.5rem', color: 'var(--color-charcoal)', fontWeight: 'bold', margin: '1rem 0' }}>{userPersona?.title || "UNKNOWN"}</p>
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Assigned via K-Means</p>
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--color-cardboard)', border: '1px solid var(--color-charcoal)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
        <strong>ADMIN LOGS:</strong>
        <ul style={{ listStyleType: 'square', paddingLeft: '1.5rem', marginTop: '0.5rem', color: '#555' }}>
          <li>[10:12:04] Gradient descent applied on vector after meal feedback.</li>
          <li>[10:14:22] Exploitation parameters favored over Exploration (Go Wild).</li>
          <li>[10:15:00] Location verified. Distance to vendor: 2.4km.</li>
        </ul>
      </div>
    </div>
  );
}
