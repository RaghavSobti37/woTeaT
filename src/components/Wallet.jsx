import React, { useState, useEffect } from 'react';
import { getWalletBalance, getLedger, loadWalletFunds, resetLedger } from '../utils/walletLedger';
import { SovietStar, CanteenGear } from './Graphics';


export default function Wallet({ onUpdate }) {
  const [balance, setBalance] = useState(0);
  const [ledger, setLedger] = useState([]);
  const [customAmount, setCustomAmount] = useState("1000");
  const [showUpiPortal, setShowUpiPortal] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [lastTxId, setLastTxId] = useState("");

  const refreshWalletData = () => {
    setBalance(getWalletBalance());
    setLedger(getLedger().reverse()); // Show newest first
  };

  useEffect(() => {
    refreshWalletData();
  }, []);

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    if (!customAmount || isNaN(customAmount) || Number(customAmount) <= 0) return;
    setShowUpiPortal(true);
    setPaymentSuccess(false);
  };

  const executePayment = () => {
    setLoadingPayment(true);
    setTimeout(() => {
      const amountNum = Number(customAmount);
      const tx = loadWalletFunds(amountNum, "GPay/BHIM Soviet UPI");
      
      setLastTxId(tx.id);
      setLoadingPayment(false);
      setPaymentSuccess(true);
      refreshWalletData();
      if (onUpdate) onUpdate();
      
      setTimeout(() => {
        setShowUpiPortal(false);
        setPaymentSuccess(false);
      }, 2500);
    }, 1500);
  };

  const handleResetLedger = () => {
    if (window.confirm("RESET ENTIRE DOUBLE-ENTRY LEDGER TO SIGNUP STATE?")) {
      resetLedger();
      refreshWalletData();
      if (onUpdate) onUpdate();
    }
  };

  return (
    <div>
      <div className="soviet-panel tilt-left">
        <div className="soviet-stamp">LEDGER DEPT</div>
        <h3 className="stencil-header" style={{ fontSize: '1.5rem' }}>COMMISSARIAT WALLET</h3>
        
        <div style={{ background: 'var(--color-charcoal)', color: 'white', padding: '1.25rem', textAlign: 'center', margin: '1rem 0', boxShadow: '4px 4px 0 var(--color-cardboard)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>AUTHORIZED DIGITAL RATION BALANCE</p>
          <h2 style={{ fontSize: '2.8rem', fontFamily: 'var(--font-mono)', color: 'var(--color-paper-light)', margin: '0.2rem 0' }}>
            ₹{balance.toLocaleString('en-IN')}
          </h2>
          <span style={{ fontSize: '0.7rem', color: '#aaa', fontFamily: 'var(--font-mono)' }}>ACCOUNTS SYSTEM: assets:wallet</span>
        </div>

        <form onSubmit={handleDepositSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>
              DEPOSIT CAPITAL INFLOW (INR):
            </label>
            <input 
              type="number" 
              className="soviet-input" 
              value={customAmount} 
              onChange={(e) => setCustomAmount(e.target.value)} 
              placeholder="Enter amount"
              min="100"
            />
          </div>
          
          <button type="submit" className="soviet-btn btn-red btn-block" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <SovietStar width="16" height="16" /> INITIATE MOCK UPI ACQUISITION <SovietStar width="16" height="16" />
          </button>
        </form>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button className="soviet-btn btn-small" onClick={() => setCustomAmount("500")}>₹500</button>
          <button className="soviet-btn btn-small" onClick={() => setCustomAmount("1000")}>₹1000</button>
          <button className="soviet-btn btn-small" onClick={() => setCustomAmount("2000")}>₹2000</button>
          <button className="soviet-btn btn-small btn-block" style={{ color: 'var(--color-red)' }} onClick={handleResetLedger}>RESET LEDGER</button>
        </div>
      </div>

      {showUpiPortal && (
        <div className="soviet-panel tilt-right" style={{ border: '3px dashed var(--color-red)' }}>
          <div className="soviet-stamp red-stamp">SECURE ESCROW</div>
          <h3 style={{ color: 'var(--color-red)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <CanteenGear width="22" height="22" /> STATE BANK OF MOCK UPI <CanteenGear width="22" height="22" />
          </h3>
          <p style={{ fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '1rem', textAlign: 'center' }}>
            Authorizing transfer of funds from equity:capital to assets:wallet.
          </p>

          <div className="upi-ration-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', borderBottom: '1.5px solid var(--color-charcoal)', paddingBottom: '0.5rem' }}>
              <span>REF-ID: UPI-SOV-9943</span>
              <span>STATE: ACTIVE</span>
            </div>

            <div style={{ margin: '1rem 0', textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>TRANSFERRED QUANTITY</p>
              <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-mono)' }}>₹{Number(customAmount).toLocaleString()}</h2>
            </div>

            <div className="ration-grid">
              <div className="ration-cell">SECURE</div>
              <div className="ration-cell">ESCROW</div>
              <div className="ration-cell">COMMODITY</div>
            </div>

            {!loadingPayment && !paymentSuccess && (
              <button className="soviet-btn btn-red btn-block" onClick={executePayment}>
                APPROVE LEDGER TRANSACTION ➔
              </button>
            )}

            {loadingPayment && (
              <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', padding: '1rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <SovietStar width="18" height="18" className="logo-star" /> STAMPING LEDGER RECORDS...
              </div>
            )}

            {paymentSuccess && (
              <div style={{ background: '#D4EDDA', border: '1px solid #C3E6CB', color: '#155724', padding: '0.75rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                ✓ TRANSACTION RECORDED IN LEDGER AS {lastTxId}!
              </div>
            )}
          </div>
        </div>
      )}

      <div className="soviet-panel tilt-left">
        <h3 className="stencil-header">LEDGER TRANSACTIONS LOG</h3>
        <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem', fontStyle: 'italic' }}>
          Strict double-entry accounting records stored in LocalStorage database.
        </p>

        <div style={{ maxHeight: '350px', overflowY: 'auto', border: '1.5px solid var(--color-charcoal)' }}>
          {ledger.map((tx) => (
            <div key={tx.id} className="typewriter-receipt" style={{ marginTop: '0', borderBottom: '1px dashed #ccc' }}>
              <div className="typewriter-row" style={{ fontWeight: 'bold' }}>
                <span>{tx.id}</span>
                <span>{new Date(tx.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="typewriter-row">
                <span>DEBIT: {tx.debitAccount}</span>
                <span style={{ color: tx.debitAccount === 'assets:wallet' ? 'green' : 'inherit' }}>
                  {tx.debitAccount === 'assets:wallet' ? `+₹${tx.amount}` : ''}
                </span>
              </div>
              <div className="typewriter-row">
                <span>CREDIT: {tx.creditAccount}</span>
                <span style={{ color: tx.creditAccount === 'assets:wallet' ? 'red' : 'inherit' }}>
                  {tx.creditAccount === 'assets:wallet' ? `-₹${tx.amount}` : ''}
                </span>
              </div>
              <div className="typewriter-row" style={{ fontStyle: 'italic', fontSize: '0.75rem', color: '#555', marginTop: '0.2rem' }}>
                <span>DESC: {tx.description}</span>
                {tx.debitAccount !== 'assets:wallet' && tx.creditAccount !== 'assets:wallet' && (
                  <span>[₹{tx.amount}]</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
