import React, { useState } from 'react';
import { SovietStar, CanteenGear } from './Graphics';


const REGIONS = [
  "Nashik Road (Home)",
  "Satpur MIDC (Office)",
  "College Road (University)",
  "Panchavati (Temple)",
  "Gangapur Road (Apartments)",
  "Sula Vineyards (Luxury)"
];

export default function LocationScheduler({ onAddToast }) {
  const [schedule, setSchedule] = useState({
    morning: { time: "08:00 AM", location: "Nashik Road (Home)" },
    midday: { time: "01:00 PM", location: "Satpur MIDC (Office)" },
    evening: { time: "08:00 PM", location: "Nashik Road (Home)" }
  });

  const [simulatedTime, setSimulatedTime] = useState("midday"); // morning, midday, evening
  const [simulatedGPS, setSimulatedGPS] = useState("Satpur MIDC (Office)");

  const handleScheduleChange = (slot, location) => {
    setSchedule(prev => ({
      ...prev,
      [slot]: { ...prev[slot], location }
    }));
    
    onAddToast({
      title: "SCHEDULE REGISTERED",
      message: `Updated ${slot.toUpperCase()} destination to ${location}.`,
      type: "info"
    });
  };

  const runLocationCheck = () => {
    const activeSlot = schedule[simulatedTime];
    const scheduledLocation = activeSlot.location;
    const currentGPS = simulatedGPS;
    const timeStr = activeSlot.time;

    if (scheduledLocation === currentGPS) {
      onAddToast({
        title: "DISPATCH PING ROUTED",
        message: `Ration delivery scheduled for ${timeStr} dispatched to ${scheduledLocation}. GPS confirmed.`,
        type: "success"
      });
    } else {
      onAddToast({
        title: "LOCATION MISMATCH",
        message: `Clock is ${timeStr}. Scheduled: ${scheduledLocation}. GPS says: ${currentGPS}. FALLBACK INITIATED: Redirecting delivery to current GPS [${currentGPS}] in 1 hour.`,
        type: "warning"
      });
    }
  };

  return (
    <div className="soviet-panel tilt-right">
      <div className="soviet-stamp">LOGISTICS</div>
      <h3 className="stencil-header" style={{ fontSize: '1.5rem' }}>LOGISTICS & LOCATION</h3>
      
      <p style={{ fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '1rem' }}>
        Configure your location schedule. In case of unexpected relocations, our automated delivery will fallback to active GPS pings.
      </p>

      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', marginTop: '1rem' }}>DAILY LOGISTICS REGISTRY:</h4>
      <div className="scheduler-grid">
        {/* Morning Slot */}
        <div className="schedule-item">
          <span className="schedule-time-badge">MORNING (8:00 AM)</span>
          <select 
            style={{ fontFamily: 'var(--font-mono)', padding: '0.25rem', border: '1px solid var(--color-charcoal)' }}
            value={schedule.morning.location}
            onChange={(e) => handleScheduleChange('morning', e.target.value)}
          >
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Midday Slot */}
        <div className="schedule-item">
          <span className="schedule-time-badge">MIDDAY (1:00 PM)</span>
          <select 
            style={{ fontFamily: 'var(--font-mono)', padding: '0.25rem', border: '1px solid var(--color-charcoal)' }}
            value={schedule.midday.location}
            onChange={(e) => handleScheduleChange('midday', e.target.value)}
          >
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Evening Slot */}
        <div className="schedule-item">
          <span className="schedule-time-badge">EVENING (8:00 PM)</span>
          <select 
            style={{ fontFamily: 'var(--font-mono)', padding: '0.25rem', border: '1px solid var(--color-charcoal)' }}
            value={schedule.evening.location}
            onChange={(e) => handleScheduleChange('evening', e.target.value)}
          >
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div className="soviet-line-heavy"></div>

      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--color-red)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <CanteenGear width="20" height="20" /> LOCATION PING SIMULATOR
      </h4>
      <p style={{ fontSize: '0.8rem', color: '#555', marginBottom: '1rem' }}>
        Simulate clock time and physical smartphone GPS coordinates to test routing fallbacks.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>
            SIMULATE CLOCK TIME:
          </label>
          <select 
            className="soviet-input"
            style={{ fontSize: '0.9rem' }}
            value={simulatedTime}
            onChange={(e) => setSimulatedTime(e.target.value)}
          >
            <option value="morning">Morning (8:00 AM)</option>
            <option value="midday">Midday (1:00 PM)</option>
            <option value="evening">Evening (8:00 PM)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>
            SIMULATE DEVICE GPS:
          </label>
          <select 
            className="soviet-input"
            style={{ fontSize: '0.9rem' }}
            value={simulatedGPS}
            onChange={(e) => setSimulatedGPS(e.target.value)}
          >
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <button className="soviet-btn btn-red btn-block" onClick={runLocationCheck} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <SovietStar width="18" height="18" /> TRIGGER DEVICE LOCATION PING <SovietStar width="18" height="18" />
      </button>
    </div>
  );
}
