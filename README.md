# WoTeaT: Self-Learning Food Discovery Engine

WoTeaT is an autonomous, self-learning food ordering platform that dynamically matches user taste profiles with real-time restaurant menus using PostgreSQL vector search and the ONDC network.

## 1. Frontend Design and Flow
*(See [Detailed Frontend Flowchart](docs/frontend-flow.md))*

The frontend is a Progressive Web App (PWA) built with Vite/React (or Next.js) tailored for an immersive, premium user experience.

### Key Flows
- **Onboarding & Taste Profiling:** New users undergo a dynamic onboarding survey. The system translates their preferences into a baseline 5-dimensional "Taste Vector" `[Spice, Cream, Fry, Tang, Carb]`.
- **Dashboard & Curation:** The dashboard avoids overwhelming the user with endless choices. It presents highly curated dishes matching their vector. A "Go Wild" toggle inverts their taste axes for serendipitous discovery.
- **Automated Ordering:** Users add funds to an internal UPI wallet. The frontend dispatches order intents to the backend, which silently negotiates with ONDC. The frontend then subscribes to live delivery status (`Packed`, `Out-for-delivery`).
- **Design System:** Features a unique constructivist aesthetic, utilizing a custom SVG cutout graphics library (`Graphics.jsx`) instead of generic emojis, ensuring a high-end, cohesive brand identity.

## 2. Backend Design and Flow
*(See [Detailed Backend Flowchart](docs/backend-flow.md))*

The backend is an Express/Node.js microservices architecture designed for high throughput and ONDC integration.

### Core Architecture
- **Self-Learning Engine (pgvector):** User taste profiles and restaurant dishes are stored as `VECTOR(5)` types in PostgreSQL. The backend utilizes `cosineDistance` matching via an HNSW index to find the mathematical closest dish to a user's taste, adjusting vectors over time based on feedback (Contextual Bandit pattern).
- **ONDC Integration (Beckn Protocol):** Instead of fragile scraping, the backend communicates with the ONDC network as a Buyer App. Massive incoming `/on_search` webhook payloads are absorbed via message queues.
- **LLM Tagging Service:** A background worker utilizes the Gemini API to parse raw text menus from ONDC and translate them into 5-dimensional mathematical arrays asynchronously.
- **Safety & Resilience:** 
  - **Idempotency Keys & ACID Transactions** guarantee the user's internal wallet is never double-charged during network drops.
  - **Dead Letter Queues (DLQ)** handle rejected orders (e.g., restaurant out of stock) by instantly refunding the wallet and selecting the next best dish invisibly.

## 3. Local Startup Guide

To run WoTeaT locally for development:

### Prerequisites
- Node.js (v18+)
- PostgreSQL (or a free Supabase instance)
- Redis (optional for local, `ioredis-mock` will take over if not present)

### Setup Steps
1. **Clone & Install:**
   ```bash
   cd woTeaT
   npm install
   cd backend
   npm install
   ```
2. **Environment Variables:**
   Create `.env` in the `backend/` folder:
   ```env
   PORT=5001
   POSTGRES_URL=postgres://user:password@localhost:5432/woteat
   GEMINI_API_KEY=your_gemini_key
   # REDIS_URL=redis://localhost:6379 (Leave blank to use mock queue locally)
   ```
3. **Start the Backend:**
   ```bash
   cd backend
   node server.js
   ```
   *(Note: The server will automatically run `CREATE EXTENSION IF NOT EXISTS vector;` and sync the database models.)*
4. **Start the Frontend:**
   ```bash
   cd ..
   npm run dev
   ```

## 4. Production Setup (Vercel + Supabase)

Transitioning from local to a production environment requires enabling strict security and high-availability infrastructure.

1. **Database Preparation (Supabase):**
   - Provision a PostgreSQL database. Ensure the `pgvector` extension is active.
   - Run the initial migrations to establish the `VECTOR(5)` columns and HNSW indexes.
2. **Redis Cloud:**
   - Provision a Redis cluster (e.g., Upstash or Redis Enterprise) to act as the BullMQ broker for ONDC webhooks and LLM tasks. Set `REDIS_URL` in production.
3. **Backend Deployment (Vercel/Render):**
   - Deploy the Node.js backend. If using Vercel, ensure `server.js` exports the Express app correctly for serverless functions, or deploy as a persistent service on Render/Railway.
4. **Security & Cryptography:**
   - Enable Beckn Signature Verification middleware in `/routes/ondc.js` to ensure incoming webhooks are cryptographically signed by verified ONDC nodes.
5. **Frontend Deployment:**
   - Connect the root directory to Vercel. Ensure environment variables (`VITE_API_URL`) point to the production backend. Build output should be `dist`.
