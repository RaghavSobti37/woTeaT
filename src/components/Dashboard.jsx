import React, { useState, useEffect } from 'react';
import { RESTAURANTS } from '../data/restaurants';
import { getRecommendations } from '../utils/vectorEngine';
import { getWalletBalance, deductWalletForOrder, checkAndTriggerAutoReplenish, getLedger } from '../utils/walletLedger';
import { getSVGIcon, SovietStar, CanteenGear } from './Graphics';


export default function Dashboard({ userVector, userPersona, onAddToast, onUpdateWallet, activeTab, setActiveTab }) {
  const [recommendations, setRecommendations] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(RESTAURANTS[0]);
  const [savingsValue, setSavingsValue] = useState(380); // Default simulated savings
  const [recentCategories, setRecentCategories] = useState([]);

  const loadRecommendations = () => {
    // 1. Get recent categories from ledger
    const ledger = getLedger();
    const categoriesOrdered = ledger
      .filter(tx => tx.debitAccount === "expenses:food")
      .map(tx => {
        // Extract category name from description e.g. "RATION RENDERED: Chulivarchi Misal Pav [Sadhana Chulivarchi Misal]"
        // But since we want to be safe, let's look at recent order entries.
        // We'll extract what is in between "RATION RENDERED: " and " ["
        const match = tx.description.match(/RATION RENDERED: (.*) \[(.*)\]/);
        if (match) {
          const dishName = match[1];
          // Find dish category
          for (let r of RESTAURANTS) {
            for (let d of r.dishes) {
              if (d.name === dishName) return d.category;
            }
          }
        }
        return null;
      })
      .filter(c => c !== null);

    // Take last 3 items for fatigue sliding window
    const recent = categoriesOrdered.slice(-3);
    setRecentCategories(recent);

    // 2. Fetch sorted matches
    const recs = getRecommendations(userVector, RESTAURANTS, recent);
    setRecommendations(recs);

    // 3. Compute simulated savings: ₹60 per order + ₹30 delivery fee saved
    const orderCount = ledger.filter(tx => tx.debitAccount === "expenses:food").length;
    setSavingsValue((orderCount * 90) + 120); // Base bonus savings
  };

  useEffect(() => {
    loadRecommendations();
  }, [userVector]);

  const handleOrderMeal = (dish, restaurantName) => {
    try {
      // 1. Deduct wallet
      const tx = deductWalletForOrder(dish.price, dish.name, restaurantName);
      
      onAddToast({
        title: "★ MEAL RATION ORDERED ★",
        message: `Dispatched "${dish.name}" from ${restaurantName}. Charged: ₹${dish.price}.`,
        type: "success"
      });

      // 2. Check for auto-replenish
      const autoReplenish = checkAndTriggerAutoReplenish();
      if (autoReplenish.triggered) {
        onAddToast({
          title: "🔔 AUTO-REPLENISHMENT 🔔",
          message: `Wallet balance dropped low. Automatically loaded ₹${autoReplenish.amount} from Capital Escrow.`,
          type: "info"
        });
      }

      // 3. Update dashboard state
      loadRecommendations();
      onUpdateWallet();
    } catch (err) {
      onAddToast({
        title: "⚠️ TRANSACTION DENIED ⚠️",
        message: err.message,
        type: "warning"
      });
      
      // Auto switch tab to wallet to prompt user
      setActiveTab("wallet");
    }
  };

  return (
    <div>
      {/* Soviet Savings Illusion Banner */}
      <div className="savings-banner">
        <span>PROLETARIAT METRICS: COMMUNITY DINING SCHEME HAS SAVED YOU ₹{savingsValue} IN INDIVIDUAL MARKUPS!</span>
      </div>

      <div className="app-grid">
        {/* Left Side: Recommendations & Browse */}
        <div>
          {/* Persona Card */}
          <div className="soviet-panel tilt-left" style={{ borderStyle: 'double', borderWidth: '5px' }}>
            <div className="soviet-stamp red-stamp">{userPersona.stencil}</div>
            <h3 className="stencil-header" style={{ fontSize: '1.4rem' }}>ACTIVE TASTE PASSPORT</h3>
            <div style={{ marginTop: '0.5rem' }}>
              <h2 style={{ color: 'var(--color-charcoal)', fontSize: '1.6rem' }}>{userPersona.title}</h2>
              <p style={{ fontSize: '0.9rem', color: '#444', fontStyle: 'italic', marginTop: '0.2rem' }}>
                "{userPersona.description}"
              </p>
            </div>
            
            <div className="soviet-divider"></div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              <span>ACTIVE PROFILE VECTORS:</span>
              {[
                { l: "SPY", v: userVector[0] },
                { l: "SWT", v: userVector[1] },
                { l: "TNG", v: userVector[2] },
                { l: "CAL", v: userVector[3] },
                { l: "TRD", v: userVector[4] }
              ].map((item, i) => (
                <span key={i} style={{ background: 'var(--color-cardboard)', padding: '2px 6px', border: '1px solid var(--color-charcoal)' }}>
                  {item.l}: {item.v.toFixed(2)}
                </span>
              ))}
            </div>
          </div>

          {/* Daily Recommendations */}
          <div className="soviet-panel tilt-right">
            <h3 className="stencil-header">TODAY'S DIET RECOMMENDATIONS</h3>
            <p style={{ fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '1.25rem' }}>
              Calculated matching vector similarity. 50% fatigue penalty is active on recent categories: 
              {recentCategories.length === 0 ? " None yet" : ` [${recentCategories.join(', ')}]`}.
            </p>

            <div className="recommendation-list">
              {recommendations.slice(0, 5).map((dish) => (
                <div key={dish.id} className="dish-card">
                  <div className="dish-illustration" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-cardboard)' }}>
                    <span className="dish-match-badge">{dish.finalScore}% MATCH</span>
                    {getSVGIcon(dish.icon, "40", "40")}
                  </div>
                  
                  <div className="dish-details">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '1.15rem' }}>{dish.name}</h4>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        ₹{dish.price}
                      </span>
                    </div>
                    
                    <p style={{ fontSize: '0.8rem', color: '#666', fontFamily: 'var(--font-mono)' }}>
                      DISTRIBUTOR: {dish.restaurantName}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-light)' }}>
                      {dish.description}
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      <div className="dish-tags">
                        <span className="dish-tag">{dish.category.toUpperCase()}</span>
                        <span className="dish-tag" style={{ color: dish.isVeg ? '#1E4620' : '#8A1F1F' }}>
                          {dish.isVeg ? "VEG" : "NON-VEG"}
                        </span>
                        {dish.isFatigued && (
                          <span className="dish-tag" style={{ background: 'var(--color-red-light)', color: 'var(--color-red)', fontWeight: 'bold' }}>
                            FATIGUE PENALTY
                          </span>
                        )}
                      </div>
                      
                      <button 
                        className="soviet-btn btn-red btn-small"
                        onClick={() => handleOrderMeal(dish, dish.restaurantName)}
                      >
                        ORDER RATION
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Restaurant Registry */}
          <div className="soviet-panel tilt-left">
            <h3 className="stencil-header">NASHIK RESTAURANT REGISTRY (20)</h3>
            <p style={{ fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '1rem' }}>
              Select a cooperative canteen to inspect specific local offerings.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <select 
                className="soviet-input"
                style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '1.1rem' }}
                value={selectedRestaurant.id}
                onChange={(e) => {
                  const r = RESTAURANTS.find(item => item.id === e.target.value);
                  setSelectedRestaurant(r);
                }}
              >
                {RESTAURANTS.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.type})</option>
                ))}
              </select>
            </div>

            <div className="restaurant-details-modal">
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--color-charcoal)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>
                <h4 style={{ color: 'var(--color-red)' }}>{selectedRestaurant.name}</h4>
                <span style={{ fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {getSVGIcon("star", "16", "16")} {selectedRestaurant.rating} / 5.0
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                <strong>LOCATION:</strong> {selectedRestaurant.location} | <strong>SCHEME:</strong> {selectedRestaurant.type}
              </p>

              <h5 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>CANTEEN OFFERINGS:</h5>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {selectedRestaurant.dishes.map((dish) => {
                  // Calculate raw baseline score without fatigue to show pure suitability
                  const recommendations = getRecommendations(userVector, [selectedRestaurant], []);
                  const dishMatch = recommendations.find(item => item.id === dish.id);
                  const rawScore = dishMatch ? dishMatch.baseScore : 0;
                  
                  return (
                    <div key={dish.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-paper-dark)', padding: '0.6rem 0.8rem', border: '1px solid var(--color-charcoal)' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          {getSVGIcon(dish.icon, "20", "20")}
                          <strong style={{ fontSize: '0.95rem' }}>{dish.name}</strong>
                          <span style={{ fontSize: '0.7rem', background: 'var(--color-charcoal)', color: 'white', padding: '1px 4px', fontFamily: 'var(--font-mono)' }}>
                            {rawScore}% MATCH
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#555' }}>{dish.description}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>₹{dish.price}</span>
                        <button 
                          className="soviet-btn btn-small"
                          onClick={() => handleOrderMeal(dish, selectedRestaurant.name)}
                        >
                          ORDER
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Stats, Ration Cards */}
        <div>
          <div className="soviet-panel tilt-right" style={{ background: 'var(--color-cardboard)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-charcoal)', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
              <SovietStar width="18" height="18" /> RATION SCHEME <SovietStar width="18" height="18" />
            </h3>
            <p style={{ fontSize: '0.8rem', fontStyle: 'italic', margin: '0.3rem 0 1rem 0', textAlign: 'center' }}>
              Select subscription tier.
            </p>
            
            <div style={{ border: '2px dashed var(--color-charcoal)', padding: '0.75rem', background: '#F2EFE9', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--color-red)' }}>COMRADE WEEKLY PLAN</h4>
              <p style={{ fontSize: '0.75rem' }}>7 scheduled meal dispatches, automated logistics routing.</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>₹750 / Week</span>
                <span style={{ fontSize: '0.7rem', background: 'var(--color-army-green)', color: 'white', padding: '2px 5px', fontFamily: 'var(--font-mono)' }}>
                  ACTIVE TIER
                </span>
              </div>
            </div>

            <div style={{ border: '1px solid var(--color-charcoal)', padding: '0.75rem', background: 'var(--color-paper-light)', opacity: 0.6, marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '1rem' }}>SOVIET MONTHLY UNION</h4>
              <p style={{ fontSize: '0.75rem' }}>30 meal dispatches, custom flavor vector calibrations.</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>₹2,800 / Month</span>
                <button className="soviet-btn btn-small btn-red" style={{ fontSize: '0.7rem' }}>UPGRADE</button>
              </div>
            </div>
          </div>

          <div className="soviet-panel tilt-left">
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-charcoal)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CanteenGear width="20" height="20" /> COMMISSARIAT SYSTEM INFO
            </h3>
            <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <div>HOST: WOTEAT.PWA.LOCAL</div>
              <div>COOPERATIVE OUTLETS: 20 ACTIVE</div>
              <div>LEDGER STATUS: DOUBLE-ENTRY BALANCED</div>
              <div>RECO ENGINE: COSINE SIMILARITY 5D</div>
              <div>FATIGUE WINDOW: 3 DAYS (50% SCORE PENALTY)</div>
              <div style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>REPLENISHMENT CRITICAL LIMIT: ₹500</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
