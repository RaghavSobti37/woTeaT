// Double-Entry Ledger System for WoTeaT Subscriptions
// Follows strict accounting principles: Debits must balance Credits.
// Accounts:
// - assets:wallet (User's subscription wallet balance)
// - equity:capital (External funds loaded via mock UPI)
// - expenses:food (Cost of meals ordered)
// - revenues:promotions (Starting signup bonus or promotional credits)

const STORAGE_KEY = "woteat_ledger_v1";

/**
 * Initializes the ledger in localStorage.
 * Adds a promotional ₹1000 credit on signup.
 */
export function initLedger() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) {
    return JSON.parse(existing);
  }
  
  // Create first transaction: Signup Promotion
  const initialTx = {
    id: "TX-00001",
    timestamp: new Date().toISOString(),
    debitAccount: "assets:wallet",       // Destination
    creditAccount: "revenues:promotions", // Source
    amount: 1000,
    description: "PROLETARIAT SIGNUP WELCOME BONUS CREDIT"
  };
  
  const ledger = [initialTx];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger));
  return ledger;
}

export function getLedger() {
  const ledger = localStorage.getItem(STORAGE_KEY);
  if (!ledger) return initLedger();
  return JSON.parse(ledger);
}

/**
 * Calculates current balance of assets:wallet
 */
export function getWalletBalance() {
  const ledger = getLedger();
  let balance = 0;
  
  ledger.forEach((tx) => {
    // If wallet is debited (assets:wallet increases in accounting, but here wallet is an asset,
    // so Debit increases assets:wallet, Credit decreases assets:wallet)
    // To keep it simple:
    // Debit assets:wallet = wallet balance increases
    // Credit assets:wallet = wallet balance decreases
    if (tx.debitAccount === "assets:wallet") {
      balance += tx.amount;
    }
    if (tx.creditAccount === "assets:wallet") {
      balance -= tx.amount;
    }
  });
  
  return balance;
}

/**
 * General ledger transaction insertion
 */
export function recordTransaction(debitAccount, creditAccount, amount, description) {
  const ledger = getLedger();
  const nextIdNum = ledger.length + 1;
  const idStr = `TX-${String(nextIdNum).padStart(5, '0')}`;
  
  const tx = {
    id: idStr,
    timestamp: new Date().toISOString(),
    debitAccount,
    creditAccount,
    amount: Number(amount),
    description: description.toUpperCase()
  };
  
  ledger.push(tx);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger));
  return tx;
}

/**
 * Load funds into wallet via UPI
 */
export function loadWalletFunds(amount, method = "MOCK UPI TRANSFER") {
  return recordTransaction(
    "assets:wallet", 
    "equity:capital", 
    amount, 
    `DEPOSIT RECEIVED VIA ${method}`
  );
}

/**
 * Deduct wallet balance for a meal order
 */
export function deductWalletForOrder(amount, dishName, restaurantName) {
  const balance = getWalletBalance();
  if (balance < amount) {
    throw new Error(`INSUFFICIENT FUNDS. REQUIRED: ₹${amount}, AVAILABLE: ₹${balance}`);
  }
  
  return recordTransaction(
    "expenses:food", 
    "assets:wallet", 
    amount, 
    `RATION RENDERED: ${dishName} [${restaurantName}]`
  );
}

/**
 * Auto-replenish check:
 * If balance drops below ₹500, trigger auto-top-up of ₹1500.
 * Returns the transaction if triggered, else null.
 */
export function checkAndTriggerAutoReplenish() {
  const currentBalance = getWalletBalance();
  if (currentBalance < 500) {
    const replenishAmount = 1500;
    const tx = recordTransaction(
      "assets:wallet",
      "equity:capital",
      replenishAmount,
      "CRITICAL BALANCE AUTOMATIC REPLENISHMENT ACTIVATED"
    );
    return {
      triggered: true,
      amount: replenishAmount,
      tx
    };
  }
  return { triggered: false };
}

/**
 * Clears ledger back to signup state.
 */
export function resetLedger() {
  localStorage.removeItem(STORAGE_KEY);
  return initLedger();
}
