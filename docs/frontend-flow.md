# WoTeaT Frontend Flow

This document details the frontend interaction architecture for the WoTeaT platform.

## High-Level Flowchart

```mermaid
graph TD
    A[User Opens App] --> B{Is User Authenticated?}
    B -- No --> C[Onboarding Survey]
    C --> D[Generate Base Taste Vector]
    D --> E[Save to PostgreSQL]
    B -- Yes --> F[Dashboard]
    E --> F
    
    F --> G[Curate Daily Recommendation]
    G --> H{User Action}
    
    H -- Accept Order --> I[Deduct Wallet]
    I --> J[Trigger Backend /auto-order API]
    J --> K[Wait for ONDC /confirm]
    K --> L[Live Order Tracking UI]
    
    H -- Reject / Rate --> M[Feedback Loop]
    M --> N[Calculate Vector Drift]
    N --> O[Update DB Vector via pgvector]
    O --> G
    
    H -- "Go Wild" --> P[Invert Taste Vector Axes]
    P --> G
```

## Detailed Component Lifecycle

1. **Onboarding (`Onboarding.jsx`)**: Collects preferences (e.g. Spice tolerance, Carb preference) and maps them to a `[Spice, Cream, Fry, Tang, Carb]` vector array between `0.0` and `1.0`.
2. **Dashboard (`Dashboard.jsx`)**: The primary orchestration hub. It reads the current vector and requests curated items from the backend. 
3. **Graphics Engine (`Graphics.jsx`)**: Replaces emojis and basic UI elements with scalable SVG cutouts, defining the premium "Soviet-Constructivist" visual identity.
4. **Wallet Ledger (`walletLedger.js`)**: Manages the local state of the user's mock UPI wallet, preventing order triggers if balance is insufficient.
