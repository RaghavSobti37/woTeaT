# WoTeaT Production Setup Guide

This guide outlines the steps to take the Next.js and PostgreSQL (pgvector) architecture to a production-ready environment, integrating ONDC for live restaurant data.

## 1. Database Setup (PostgreSQL + pgvector)

For production, you need a managed PostgreSQL database that supports the `pgvector` extension. Recommended providers:
*   **Supabase** (Has built-in pgvector support)
*   **Neon**
*   **AWS RDS** (Ensure you enable pgvector)

### Steps:
1.  Provision a production PostgreSQL database.
2.  Enable the `pgvector` extension by running the following SQL command as a superuser:
    ```sql
    CREATE EXTENSION IF NOT EXISTS vector;
    ```
3.  Set the `DATABASE_URL` environment variable in your production environment (e.g., Vercel, Railway, Render).
4.  Run your Drizzle/Prisma migrations against the production database to create the `VECTOR(5)` columns.
    ```bash
    npm run db:push # or npx prisma db push
    ```

## 2. ONDC Integration (Production)

To connect to the live ONDC food network, you must transition from the Sandbox to the Production network.

### Steps:
1.  **Register as a BAP (Buyer App):** Complete the onboarding process with ONDC to receive your production BAP ID, URI, and signing keys.
2.  **Environment Variables:** Add your production ONDC credentials to your environment:
    ```env
    ONDC_BAP_ID="your_production_bap_id"
    ONDC_BAP_URI="https://api.woteat.com/ondc"
    ONDC_PRIVATE_KEY="your_production_private_key"
    ONDC_SUBSCRIBER_ID="your_subscriber_id"
    ```
3.  **Webhook Endpoints:** Ensure your server exposes the required webhooks (e.g., `/ondc/on_search`, `/ondc/on_select`, `/ondc/on_init`, `/ondc/on_confirm`, `/ondc/on_status`) and that they are publicly accessible via HTTPS.
4.  **Signing and Verification:** Use the `ondc-node` SDK to ensure all outgoing requests are signed with your private key and incoming webhook payloads are verified against the sender's public key.

## 3. Next.js Deployment

Deploy the Next.js frontend and API routes to a serverless platform for optimal scalability.

### Steps:
1.  **Vercel Deployment:** Push your code to GitHub and connect the repository to Vercel.
2.  **Environment Variables:** Configure all necessary environment variables in the Vercel dashboard:
    *   `DATABASE_URL`
    *   ONDC credentials
    *   Payment gateway keys (e.g., Razorpay/Stripe, if applicable for wallet top-ups)
    *   JWT/Auth secrets
3.  **Build Command:** Ensure your build command runs database migrations (if applicable) and builds the Next.js app:
    ```bash
    npm run build
    ```
4.  **Edge Functions:** For low-latency vector similarity searches, consider deploying the matching algorithms as Edge Functions.

## 4. CI/CD and Automation

*   **Automated Testing:** Set up GitHub Actions to run tests on every push, ensuring changes to the vector matching logic or ONDC webhooks do not break existing functionality.
*   **Monitoring:** Integrate Sentry or Datadog for error tracking, specifically monitoring ONDC webhook failures and database performance (vector queries can be resource-intensive).
*   **Wallet Transactions:** Ensure the pre-loaded UPI wallet deductions are atomic. Use database transactions when updating the wallet balance and placing the order via ONDC to prevent race conditions.

## 5. Security & Scaling Considerations

*   **Vector Query Scaling:** As your user base grows, exact nearest neighbor (KNN) searches on vectors might become slow. Implement an index like HNSW (Hierarchical Navigable Small World) or IVFFlat in pgvector to speed up approximate nearest neighbor (ANN) searches.
    ```sql
    CREATE INDEX ON user_profiles USING hnsw (taste_vector vector_cosine_ops);
    ```
*   **Rate Limiting:** Implement rate limiting on your API routes, especially the ones interacting with ONDC, to prevent abuse.
*   **Data Privacy:** Anonymize or encrypt sensitive user data (like exact GPS coordinates) before logging or storing it, complying with DPDP (Digital Personal Data Protection) Act regulations.
