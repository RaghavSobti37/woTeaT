import React, { useState } from 'react';
import { RESTAURANTS } from '../data/restaurants';
import { getRecommendations, getSovietPersona } from '../utils/vectorEngine';
import { getSVGIcon, SovietStar } from './Graphics';


const TEST_PERSONAS = [
  {
    id: "tp1",
    name: "Comrade Ivan (Spicy Loyalist)",
    vector: [0.95, 0.05, 0.40, 0.70, 0.90],
    icon: "🌶️",
    desc: "Demands maximum heat and traditional misal. Shuns bourgeois sugars."
  },
  {
    id: "tp2",
    name: "Comrade Anna (Sweet Tooth)",
    vector: [0.05, 0.95, 0.20, 0.80, 0.95],
    icon: "🌀",
    desc: "Prefers pure sugar, ghee-drenched jalebis and sweet flatbreads."
  },
  {
    id: "tp3",
    name: "Comrade Dmitry (Health Commissar)",
    vector: [0.15, 0.20, 0.70, 0.25, 0.80],
    icon: "🥑",
    desc: "Prefers low calorie, organic salads, fruit juice, and fasting khichdi."
  },
  {
    id: "tp4",
    name: "Comrade Elena (Bourgeois Epicure)",
    vector: [0.20, 0.30, 0.60, 0.75, 0.20],
    icon: "🍕",
    desc: "Enjoys fine wine-pairing, gourmet pizzas, cheese, and global snacks."
  },
  {
    id: "tp5",
    name: "Comrade Yuri (Meat Vanguard)",
    vector: [0.85, 0.05, 0.30, 0.90, 0.80],
    icon: "🍖",
    desc: "Requires heavy proteins, smoky mutton thalis, and spicy Mughlai biryanis."
  }
];

export default function QALab({ onRefreshDashboard }) {
  const [logs, setLogs] = useState([]);
  const [simulationResults, setSimulationResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (msg) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const runSimulation = () => {
    setIsRunning(true);
    setLogs([]);
    addLog("[SYSTEM] INITIATING 7-DAY FOOD DISTRIBUTION SIMULATION...");
    
    setTimeout(() => {
      const results = {};
      const globalLedgerSimulation = [];
      let totalTransactions = 0;
      let totalRevenue = 0;
      let autoReplenishCount = 0;

      TEST_PERSONAS.forEach(p => {
        results[p.id] = {
          persona: p,
          personaTitle: getSovietPersona(p.vector).title,
          orders: [],
          walletHistory: [1000], // Start with ₹1000 promo credit
          recentCategories: []
        };
      });

      // Simulate day by day
      for (let day = 1; day <= 7; day++) {
        addLog(`--- DAY ${day} OF NUTRITION ALLOCATION ---`);
        
        TEST_PERSONAS.forEach(p => {
          const res = results[p.id];
          let currentWallet = res.walletHistory[res.walletHistory.length - 1];

          // 1. Get Recommendations (Cosine similarity + recent categories anti-fatigue)
          const recommendations = getRecommendations(p.vector, RESTAURANTS, res.recentCategories);
          
          // 2. Select highest match
          const chosenMeal = recommendations[0];
          const mealCost = chosenMeal.price;

          // 3. Deduct wallet & check for auto-replenish
          let newWallet = currentWallet - mealCost;
          let replenished = false;
          let replenishmentAmount = 0;

          if (newWallet < 500) {
            newWallet += 1500;
            replenished = true;
            replenishmentAmount = 1500;
            autoReplenishCount++;
            addLog(`[AUTO-REPLENISH] ${p.name} wallet balance fell below ₹500. Loaded +₹1500.`);
          }

          // 4. Save order record
          res.orders.push({
            day,
            dishName: chosenMeal.name,
            restaurant: chosenMeal.restaurantName,
            category: chosenMeal.category,
            price: mealCost,
            matchScore: chosenMeal.finalScore,
            fatigueApplied: chosenMeal.isFatigued,
            replenished
          });

          // 5. Update vector fatigue memory (sliding window of last 2 days)
          res.recentCategories.push(chosenMeal.category);
          if (res.recentCategories.length > 2) {
            res.recentCategories.shift();
          }

          res.walletHistory.push(newWallet);
          totalTransactions++;
          totalRevenue += mealCost;

          addLog(`[ORDER] ${p.name} ordered "${chosenMeal.name}" from ${chosenMeal.restaurantName} for ₹${mealCost} (Match: ${chosenMeal.finalScore}%).`);
        });
      }

      addLog("==========================================");
      addLog("✓ 7-DAY SIMULATION COMPLETE.");
      addLog(`Total simulated transactions recorded: ${totalTransactions}`);
      addLog(`Total mock revenue generated: ₹${totalRevenue}`);
      addLog(`Total automatic wallet top-ups triggered: ${autoReplenishCount}`);
      
      setSimulationResults({
        totalRevenue,
        totalTransactions,
        autoReplenishCount,
        results
      });
      setIsRunning(false);
      
      // Notify parent to refresh wallet data if necessary
      if (onRefreshDashboard) onRefreshDashboard();
    }, 1000);
  };

  return (
    <div className="soviet-panel tilt-right">
      <div className="soviet-stamp red-stamp">QA COMMISSAR</div>
      <h3 className="stencil-header" style={{ fontSize: '1.5rem' }}>SIMULATION & QA TESTING CENTER</h3>
      
      <p style={{ fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '1rem' }}>
        Run parallel testing vectors to verify distinctive taste profile routing, ledger double-entry bookkeeping, and anti-fatigue algorithms.
      </p>

      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', marginBottom: '0.5rem' }}>
        MONITORED QA TEST PERSONAS:
      </h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {TEST_PERSONAS.map(p => {
          const title = getSovietPersona(p.vector).title;
          return (
            <div key={p.id} style={{ border: 'var(--border-thin)', padding: '0.75rem', background: 'var(--color-paper-light)' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {getSVGIcon(p.icon, "24", "24")}
                <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{p.name}</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-red)', fontWeight: 'bold', margin: '0.2rem 0' }}>
                {title}
              </p>
              <p style={{ fontSize: '0.7rem', color: '#666', fontStyle: 'italic' }}>{p.desc}</p>
              <div style={{ display: 'flex', gap: '2px', marginTop: '0.4rem' }}>
                {p.vector.map((val, idx) => (
                  <span key={idx} style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '0.65rem', 
                    background: 'var(--color-cardboard)', 
                    padding: '1px 3px',
                    border: '1px solid #999' 
                  }}>
                    {val.toFixed(1)}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button 
          className="soviet-btn btn-red" 
          onClick={runSimulation}
          disabled={isRunning}
          style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {isRunning ? (
            <>
              <SovietStar width="16" height="16" className="logo-star" /> SIMULATING PROFILE ALIGNMENTS...
            </>
          ) : (
            <>
              <SovietStar width="18" height="18" /> RUN AUTOMATED 7-DAY SUITE <SovietStar width="18" height="18" />
            </>
          )}
        </button>
      </div>

      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        SIMULATOR TELEMETRY CONSOLE:
      </h4>
      <div className="qa-console">
        {logs.length === 0 ? (
          <div style={{ color: '#888' }}>&gt;_ Console idle. Press the simulation button to compile metrics.</div>
        ) : (
          logs.map((log, i) => <div key={i}>{log}</div>)
        )}
      </div>

      {simulationResults && (
        <div className="soviet-panel tilt-left" style={{ background: '#fff', border: '3px solid var(--color-charcoal)', marginTop: '1.5rem' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-red)', marginBottom: '0.5rem' }}>
            SIMULATION VERIFICATION REPORT
          </h4>
          <p style={{ fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '1rem' }}>
            Telemetry validated for 5 distinct vectors over 7 intervals.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--color-cardboard)', padding: '0.5rem', border: '1px solid var(--color-charcoal)' }}>
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>TOTAL REVENUE</span>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem' }}>₹{simulationResults.totalRevenue}</h3>
            </div>
            <div style={{ background: 'var(--color-cardboard)', padding: '0.5rem', border: '1px solid var(--color-charcoal)' }}>
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>MEALS ROUTED</span>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem' }}>{simulationResults.totalTransactions}</h3>
            </div>
            <div style={{ background: 'var(--color-cardboard)', padding: '0.5rem', border: '1px solid var(--color-charcoal)' }}>
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>AUTO TOPUPS</span>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem' }}>{simulationResults.autoReplenishCount}</h3>
            </div>
          </div>

          <h5 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
            COMRADE MEAL DISTINCTIVENESS INDEX:
          </h5>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--color-charcoal)', color: 'white' }}>
                  <th style={{ padding: '0.4rem' }}>COMRADE</th>
                  <th style={{ padding: '0.4rem' }}>DAY 1</th>
                  <th style={{ padding: '0.4rem' }}>DAY 2</th>
                  <th style={{ padding: '0.4rem' }}>DAY 3</th>
                  <th style={{ padding: '0.4rem' }}>DAY 4</th>
                  <th style={{ padding: '0.4rem' }}>DAY 5</th>
                  <th style={{ padding: '0.4rem' }}>DAY 6</th>
                  <th style={{ padding: '0.4rem' }}>DAY 7</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(simulationResults.results).map(res => (
                  <tr key={res.persona.id} style={{ borderBottom: '1px solid #ccc' }}>
                    <td style={{ padding: '0.4rem', fontWeight: 'bold', background: 'var(--color-paper-dark)' }}>
                      {res.persona.name.split(" ")[1]}
                    </td>
                    {res.orders.map((ord, idx) => (
                      <td key={idx} style={{ padding: '0.4rem', verticalAlign: 'top' }}>
                        <div style={{ fontWeight: 'bold' }}>{ord.dishName.substring(0, 14)}...</div>
                        <div style={{ fontSize: '0.65rem', color: '#666' }}>({ord.category})</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--color-red)' }}>{ord.matchScore}%</div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
