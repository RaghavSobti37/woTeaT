# WoTeaT Backend Flow

This document outlines the background data orchestration, AI tagging, and ONDC ordering pipelines.

## High-Level Flowchart

```mermaid
graph TD
    %% ONDC Sync Flow
    subgraph ONDC Network Synchronization
    A[ONDC Network] -->|Webhooks: /on_search| B(Redis Queue: ondcSearchQueue)
    B --> C[Process Menus]
    C --> D[New Dish Discovered]
    D --> E(Redis Queue: llmTaggingQueue)
    end
    
    %% AI Tagging Flow
    subgraph AI Tagging Microservice
    E --> F[Gemini API Prompt]
    F --> G[Extract 5D Vector]
    G --> H[(PostgreSQL: MenuItems)]
    end

    %% Order Execution Flow
    subgraph User Order Lifecycle
    I[User Requests Recommendation] --> J[Extract User Taste Vector]
    J --> K[Query PostgreSQL pgvector: cosineDistance]
    K --> L[Select Best Dish]
    L --> M{Check Wallet Balance}
    M -- Insufficient --> N(Dead Letter Queue)
    M -- Sufficient --> O[Deduct Wallet + Create DB Transaction]
    O --> P[Fire ONDC /select & /init]
    P --> Q[Fire ONDC /confirm with Idempotency Key]
    Q --> R[Return Order Confirmed Status]
    end
    
    H --> K
```

## Core Backend Microservices

1. **Self-Learning PostgreSQL**: Utilizes the `pgvector` extension and an HNSW index to calculate the `cosineDistance` between the user's dynamic taste vector and thousands of LLM-tagged menu items in milliseconds.
2. **ONDC Background Sync**: ONDC uses asynchronous webhooks. When we search for a restaurant, the network replies seconds later to the `/on_search` endpoint with a massive JSON payload. `BullMQ` buffers this payload in Redis to prevent server overload.
3. **LLM Background Tagging**: Dishes arrive from ONDC as raw text (e.g. "Chicken Tikka"). A dedicated background worker utilizes the Gemini API to mathematically parse this text into a normalized 5-dimensional array and updates the `MenuItem` in PostgreSQL.
4. **Idempotency Engine**: When an order is triggered via `/auto-order`, a unique UUID (Idempotency Key) is wrapped in a strict ACID database transaction along with the wallet deduction. This prevents double-billing even if the network drops during the ONDC `/confirm` call.
