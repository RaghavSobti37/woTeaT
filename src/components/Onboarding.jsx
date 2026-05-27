import React, { useState } from 'react';
import { calculateOnboardingVector, getSovietPersona } from '../utils/vectorEngine';
import { getSVGIcon, SovietStar, LocationPin, ClockLogistics, WalletLedger } from './Graphics';
import { loadWalletFunds } from '../utils/walletLedger';

const SURVEY_QUESTIONS = [
  {
    question: "Phase 1: What flavor profile dominates your culinary consciousness?",
    desc: "Choose the seasoning that fuel your daily labor.",
    options: [
      { key: "A", text: "SPICY RED RASSA! Let the sweat run and energy rise.", icon: "🌶️" },
      { key: "B", text: "SWEET MILK CREAM. Velvet comfort and absolute sweetness.", icon: "🌀" },
      { key: "C", text: "EARTHY GARLIC SAVORY. Balanced, traditional, and solid.", icon: "🍲" }
    ]
  },
  {
    question: "Phase 2: What food texture meets your industrial standards?",
    desc: "Choose the structure that matches your chewing efficiency.",
    options: [
      { key: "A", text: "CREAMY SOFT CHEESE. Rich, thick, heavy consistency.", icon: "🧀" },
      { key: "B", text: "CRISPY GOLDEN FRITTER. Crunchy, dry, roasted.", icon: "🥔" },
      { key: "C", text: "LIQUID SOUPY BROTH. Highly fluid, hot spice hydration.", icon: "🥛" }
    ]
  },
  {
    question: "Refining: What is your culinary geographical alignment?",
    desc: "Every citizen belongs to a land. Where do your roots pull?",
    options: [
      { key: "A", text: "LOCAL NASHIK HERITAGE. Misal, Wada, local black masalas.", icon: "🌶️" },
      { key: "B", text: "PAN-INDIAN CLASSICS. Biryani, paneer tikka, slow dal.", icon: "🍛" },
      { key: "C", text: "GLOBAL BOURGEOISIE. Wood-fired pizzas, avocado salad.", icon: "🍕" }
    ]
  },
  {
    question: "Describe your caloric intake requirements.",
    desc: "Select the density of fuel needed to power your shifts.",
    options: [
      { key: "A", text: "HEAVY INDUSTRIAL FUELING. High-density, oil, pure carbs.", icon: "🥘" },
      { key: "B", text: "LIGHT MOVEMENT ENERGY. Low calorie, fresh greens, fasting vadas.", icon: "🥗" },
      { key: "C", text: "STANDARD COMRADE DIET. Mid-tier calorie, balanced nutrition.", icon: "🍲" }
    ]
  },
  {
    question: "When do your primary cravings strike?",
    desc: "Select your scheduled metabolic cycle.",
    options: [
      { key: "A", text: "EARLY SUNRISE. Hearty breakfast before the factory whistle.", icon: "🫓" },
      { key: "B", text: "MIDDAY HARVEST. Fuel at noon to carry through the sun.", icon: "🍛" },
      { key: "C", text: "MIDNIGHT RAID. Late night spicy cravings under the moon.", icon: "🍢" }
    ]
  },
  {
    question: "Select your final comfort philosophy.",
    desc: "What type of food brings absolute peace to your soul?",
    options: [
      { key: "A", text: "HOMELY HEARTH. Traditional recipes passed down generations.", icon: "🍲" },
      { key: "B", text: "MODERN EXPERIMENT. Adventurous global gastronomy.", icon: "🥑" },
      { key: "C", text: "STREET CORNER. Quick, spicy street food on the go.", icon: "🌶️" }
    ]
  }
];

export default function Onboarding({ onComplete }) {
  // Onboarding states: 'personal', 'schedule', 'budget', 'survey', 'wallet', 'passport'
  const [step, setStep] = useState('personal');
  
  // Personal Details
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [locationName, setLocationName] = useState('');
  const [gpsCoordinates, setGpsCoordinates] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Schedule Configuration
  const [breakfastTime, setBreakfastTime] = useState('08:00');
  const [lunchTime, setLunchTime] = useState('13:00');
  const [dinnerTime, setDinnerTime] = useState('20:00');

  // Budget Parameters
  const [maxBudget, setMaxBudget] = useState(600);

  // Survey
  const [currentSurveyIdx, setCurrentSurveyIdx] = useState(0);
  const [surveyAnswers, setSurveyAnswers] = useState([]);
  const [exitDirection, setExitDirection] = useState(null);

  // Wallet payment
  const [upiLoading, setUpiLoading] = useState(false);
  
  // Final Result State
  const [finalVector, setFinalVector] = useState(null);
  const [persona, setPersona] = useState(null);

  // 1. Location permission requester
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      alert("GEOLOCATION SERVICES NOT REGISTERED IN CLIENT DEVICE.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
        setGpsCoordinates(coords);
        setLocationName(`Verified GPS: [${coords}]`);
        setGpsLoading(false);
      },
      (error) => {
        alert("GEOLOCATION PERMISSION DENIED. FALLBACK TO REGIONAL SELECTOR.");
        setGpsLoading(false);
      }
    );
  };

  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !email || !locationName) {
      alert("ALL REGISTRATION FIELDS MUST BE FILLED.");
      return;
    }
    setStep('schedule');
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    setStep('budget');
  };

  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    setStep('survey');
  };

  // 2. Tinder-style forced-choice click handlers
  const handleSurveySelect = (key) => {
    const dir = key === 'A' ? 'exit-left' : key === 'B' ? 'exit-right' : 'exit-up';
    setExitDirection(dir);

    setTimeout(() => {
      const updatedAnswers = [...surveyAnswers, key];
      setSurveyAnswers(updatedAnswers);
      setExitDirection(null);

      if (currentSurveyIdx < SURVEY_QUESTIONS.length - 1) {
        setCurrentSurveyIdx(currentSurveyIdx + 1);
      } else {
        // Complete survey -> go to subscription wallet payment
        const vec = calculateOnboardingVector(updatedAnswers);
        const pers = getSovietPersona(vec);
        setFinalVector(vec);
        setPersona(pers);
        setStep('wallet');
      }
    }, 450);
  };

  // 3. UPI Authorize handler
  const handleUpiAuthorize = () => {
    setUpiLoading(true);
    setTimeout(() => {
      // Credit wallet and save profile info
      loadWalletFunds(1500, "INITIAL SUBSCRIPTION ACQUISITION");
      setUpiLoading(false);
      
      // Save all parameters in localStorage
      localStorage.setItem("woteat_user_name", name);
      localStorage.setItem("woteat_user_phone", phone);
      localStorage.setItem("woteat_user_email", email);
      localStorage.setItem("woteat_user_location", locationName);
      localStorage.setItem("woteat_user_breakfast", breakfastTime);
      localStorage.setItem("woteat_user_lunch", lunchTime);
      localStorage.setItem("woteat_user_dinner", dinnerTime);
      localStorage.setItem("woteat_user_max_budget", maxBudget);
      
      setStep('passport');
    }, 1500);
  };

  const handlePassportComplete = () => {
    onComplete(finalVector, persona);
  };

  // Screen 1: Personal Registry Form
  if (step === 'personal') {
    return (
      <div className="onboarding-container" style={{ marginTop: '1rem' }}>
        <div className="soviet-panel tilt-left">
          <div className="soviet-stamp">PHASE 1/7</div>
          <h3 className="stencil-header" style={{ fontSize: '1.4rem' }}>SET UP YOUR PROFILE</h3>
          <p style={{ fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
            Register your coordinates with the Matchmaker database.
          </p>

          <form onSubmit={handlePersonalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>
                CITIZEN NAME:
              </label>
              <input 
                type="text" 
                className="soviet-input" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Comrade Raghav" 
                required 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>
                CONTACT PHONE:
              </label>
              <input 
                type="tel" 
                className="soviet-input" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="+91 99999-99999" 
                required 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>
                EMAIL CORRESPONDENCE:
              </label>
              <input 
                type="email" 
                className="soviet-input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="raghav@commissariat.org" 
                required 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>
                LOGISTICS CODES / ADDRESS:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <input 
                  type="text" 
                  className="soviet-input" 
                  value={locationName} 
                  onChange={(e) => setLocationName(e.target.value)} 
                  placeholder="Satpur MIDC Complex, Tower A" 
                  required 
                />
                <button 
                  type="button" 
                  className="soviet-btn btn-small"
                  onClick={handleRequestLocation}
                  disabled={gpsLoading}
                >
                  <LocationPin width="16" height="16" />
                </button>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#666', fontFamily: 'var(--font-mono)' }}>
                {gpsCoordinates ? `COORDINATES CHECKED: ${gpsCoordinates}` : "CLICK PIN TO AUTHORIZE DEVICE GPS PERMISSION"}
              </span>
            </div>

            <button type="submit" className="soviet-btn btn-red btn-block" style={{ marginTop: '0.5rem' }}>
              NEXT: SET YOUR SCHEDULE ➔
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Screen 2: Time-Wheel Scheduler
  if (step === 'schedule') {
    return (
      <div className="onboarding-container">
        <div className="soviet-panel tilt-right">
          <div className="soviet-stamp">PHASE 2/7</div>
          <h3 className="stencil-header" style={{ fontSize: '1.4rem' }}>DESIGN YOUR DAILY RHYTHM</h3>
          <p style={{ fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
            Tell the algorithm exactly when you eat. We handle the curation and logistics, precisely on time.
          </p>

          <form onSubmit={handleScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-cardboard)', padding: '0.75rem', border: '1px solid var(--color-charcoal)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ClockLogistics width="20" height="20" />
                <strong>BREAKFAST SHIFT:</strong>
              </div>
              <input 
                type="time" 
                className="soviet-input" 
                style={{ width: '120px' }} 
                value={breakfastTime} 
                onChange={(e) => setBreakfastTime(e.target.value)} 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-cardboard)', padding: '0.75rem', border: '1px solid var(--color-charcoal)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ClockLogistics width="20" height="20" />
                <strong>MIDDAY HARVEST (LUNCH):</strong>
              </div>
              <input 
                type="time" 
                className="soviet-input" 
                style={{ width: '120px' }} 
                value={lunchTime} 
                onChange={(e) => setLunchTime(e.target.value)} 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-cardboard)', padding: '0.75rem', border: '1px solid var(--color-charcoal)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ClockLogistics width="20" height="20" />
                <strong>EVENING VIGIL (DINNER):</strong>
              </div>
              <input 
                type="time" 
                className="soviet-input" 
                style={{ width: '120px' }} 
                value={dinnerTime} 
                onChange={(e) => setDinnerTime(e.target.value)} 
              />
            </div>

            <button type="submit" className="soviet-btn btn-red btn-block">
              LOCK IN MY SCHEDULE ➔
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Screen 3: Budget Parameters
  if (step === 'budget') {
    return (
      <div className="onboarding-container">
        <div className="soviet-panel tilt-left">
          <div className="soviet-stamp">PHASE 3/7</div>
          <h3 className="stencil-header" style={{ fontSize: '1.4rem' }}>SET YOUR DAILY BUDGET</h3>
          <p style={{ fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
            Tell us your budget, and we'll always find you something great for that price or less.
          </p>

          <form onSubmit={handleBudgetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ width: '100%', background: 'var(--color-charcoal)', color: 'white', padding: '1.5rem', textAlign: 'center', boxShadow: '4px 4px 0 var(--color-cardboard)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>DAILY MEAL BUDGET</span>
              <h2 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-mono)', color: 'var(--color-paper-light)', margin: '0.2rem 0' }}>
                ₹{maxBudget}
              </h2>
              <span style={{ fontSize: '0.7rem', color: '#ccc', fontFamily: 'var(--font-mono)' }}>BUDGET BOUNDARY</span>
            </div>

            <div style={{ width: '100%', padding: '0 1rem' }}>
              <input 
                type="range" 
                min="200" 
                max="1000" 
                step="50"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--color-red)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                <span>MIN: ₹200</span>
                <span>MAX: ₹1,000</span>
              </div>
            </div>

            <button type="submit" className="soviet-btn btn-red btn-block">
              SET MY BOUNDARY ➔
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Screen 4, 5, 6: Visual Forced-Choice Survey Card Deck
  if (step === 'survey') {
    const q = SURVEY_QUESTIONS[currentSurveyIdx];
    return (
      <div className="onboarding-container">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '2.5rem', color: 'var(--color-red)' }}><SovietStar width="40" height="40" style={{ display: 'inline-block' }} /></span>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--color-charcoal)', marginTop: '0.5rem' }}>BUILDING YOUR TASTE PROFILE (PHASE {currentSurveyIdx + 1}/6)</h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
            MATCHMAKER ANALYSIS IN PROGRESS
          </p>
        </div>

        <div className="swipe-card-wrapper">
          <div className={`swipe-card ${exitDirection ? exitDirection : ''}`}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: 'var(--color-charcoal)', color: 'white', padding: '2px 8px' }}>
                  REF-FORM WTT-{100 + currentSurveyIdx}
                </span>
                <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>★ ★ ★</span>
              </div>
              
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-charcoal)', marginBottom: '0.5rem', lineHeight: '1.3' }}>
                {q.question}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#555', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                {q.desc}
              </p>
              
              <div className="soviet-line-heavy"></div>

              <div className="swipe-options-grid">
                {q.options.map((opt) => (
                  <button 
                    key={opt.key}
                    className="swipe-option-btn"
                    onClick={() => handleSurveySelect(opt.key)}
                  >
                    <span style={{ 
                      fontFamily: 'var(--font-mono)', 
                      fontWeight: 'bold', 
                      background: 'var(--color-charcoal)', 
                      color: 'white',
                      padding: '3px 8px',
                      borderRadius: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      {opt.key}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {getSVGIcon(opt.icon, "18", "18")}
                      {opt.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <div className="soviet-line-heavy" style={{ margin: '0.5rem 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                <span>FORCED CHOICE MATRIX</span>
                <span>PENDING VECTOR UPDATE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Screen 7: Wallet & Subscription funding (Autopilot engaged)
  if (step === 'wallet') {
    return (
      <div className="onboarding-container">
        <div className="soviet-panel tilt-right" style={{ border: '3px dashed var(--color-red)' }}>
          <div className="soviet-stamp red-stamp">PHASE 7/7</div>
          <h3 style={{ color: 'var(--color-red)', fontSize: '1.6rem', textAlign: 'center', marginBottom: '0.5rem' }}>
            LET US HANDLE IT. ADD TO YOUR FOOD FUND.
          </h3>
          <p style={{ fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center', marginBottom: '1.5rem' }}>
            Add money to your Food Fund. We'll always find you something great for your budget or less. Whatever you save stays in your fund.
          </p>

          <div className="upi-ration-card" style={{ background: '#FAF8F5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', borderBottom: '2px solid var(--color-charcoal)', paddingBottom: '0.5rem' }}>
              <span>SUITE: FOOD FUND</span>
              <span>STATE: INITIAL CODES</span>
            </div>

            <div style={{ margin: '1.5rem 0', textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>RECOMMENDED FOOD FUND</p>
              <h2 style={{ fontSize: '3rem', fontFamily: 'var(--font-mono)', color: 'var(--color-red)' }}>₹1,500</h2>
              <span style={{ fontSize: '0.65rem', color: '#666', display: 'block', marginTop: '0.2rem' }}>Includes weekly subscription credit + canteens reserves</span>
            </div>

            <div className="ration-grid" style={{ marginBottom: '1.5rem' }}>
              <div className="ration-cell" style={{ fontWeight: 'bold' }}>100% MEAL FUNDS</div>
              <div className="ration-cell" style={{ fontWeight: 'bold' }}>ZERO MARKUPS</div>
              <div className="ration-cell" style={{ fontWeight: 'bold' }}>CANCEL ANYTIME</div>
            </div>

            {!upiLoading ? (
              <button className="soviet-btn btn-red btn-block" onClick={handleUpiAuthorize}>
                AUTHORIZE VIA UPI 🫡
              </button>
            ) : (
              <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', padding: '1rem' }}>
                <CanteenGear width="24" height="24" className="logo-star" style={{ display: 'inline-block', animation: 'spin 2s linear infinite' }} />
                {" "}AUTHORIZING UPI PAYMENTS GATEWAY...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Screen 8: Passport Certificate
  if (step === 'passport') {
    return (
      <div className="onboarding-container">
        <div className="soviet-panel tilt-left" style={{ borderStyle: 'double', borderWidth: '6px' }}>
          <div className="soviet-stamp red-stamp">PROFILE READY</div>
          
          <h2 style={{ textAlign: 'center', color: 'var(--color-red)', fontSize: '2.2rem', marginBottom: '0.5rem' }}>
            ⭐ TASTE PROFILE ⭐
          </h2>
          <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
            YOUR PERSONAL MATCHMAKER PREFERENCES
          </p>
          
          <div className="soviet-line-heavy"></div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1.5rem', margin: '1.5rem 0' }}>
            <div style={{ 
              width: '100px', 
              height: '120px', 
              border: '2px solid var(--color-charcoal)', 
              background: 'var(--color-cardboard)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3.5rem'
            }}>
              🎖️
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#666' }}>COMRADE REGISTERED:</p>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--color-charcoal)', margin: '0.1rem 0' }}>
                {name}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#666', fontFamily: 'var(--font-mono)' }}>
                {phone} | {email}
              </p>
              <div className="soviet-line-heavy" style={{ margin: '0.4rem 0' }}></div>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-red)', fontWeight: 'bold' }}>
                {persona.title}
              </p>
              <p style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--color-charcoal-light)' }}>
                "{persona.description}"
              </p>
            </div>
          </div>
          
          <div className="soviet-line-heavy"></div>
          
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
            MATCHMAKER PROFILE BREAKDOWN:
          </h4>
          
          <div className="qa-vector-graph" style={{ margin: '1rem 0' }}>
            {[
              { label: "SPICY", val: finalVector[0] },
              { label: "SWEET", val: finalVector[1] },
              { label: "TANGY", val: finalVector[2] },
              { label: "CALORIC DENSITY", val: finalVector[3] },
              { label: "TRADITIONAL PIETY", val: finalVector[4] }
            ].map((item, i) => (
              <div key={i} className="qa-vector-row">
                <span style={{ width: '130px', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{item.label}:</span>
                <div className="qa-vector-bar-outer">
                  <div className="qa-vector-bar-inner" style={{ width: `${item.val * 100}%` }}></div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', width: '35px', textAlign: 'right' }}>
                  {item.val.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="soviet-line-heavy"></div>
          
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button className="soviet-btn btn-red btn-block" onClick={handlePassportComplete}>
              ENTER DASHBOARD ➔
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
