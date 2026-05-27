# WoTeaT System Setup Guide

To run the WoTeaT platform with its full backend and SMS authentication, follow these manual setup steps:

## 1. PostgreSQL Setup
1. **Local Setup:** 
   - Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/).
   - Ensure you remember your password during installation (e.g., `password`).
   - Open pgAdmin or `psql` and create a database named `woteat`.
   - The default connection URI `postgres://postgres:password@localhost:5432/woteat` is in the `.env` file. Adjust username/password if needed.
2. **Cloud Setup (Alternative):**
   - Create a free Postgres database on Render or Supabase.
   - Get your connection string (URI).
   - Update `backend/.env` with `POSTGRES_URI=your_cloud_connection_string`.

## 2. Twilio SMS OTP Setup
1. Go to [twilio.com](https://www.twilio.com/) and create an account.
2. Get a Twilio phone number.
3. In your Twilio console, copy your **Account SID** and **Auth Token**.
4. Update `backend/.env` with these values:
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_number
   ```
*(Note: If you do not configure Twilio, the backend will print OTPs to the server console instead of sending SMS.)*

## 3. Starting the Backend Server
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
   *(The server will run on `http://localhost:5000`)*

## 4. Starting the Frontend
1. Open a new terminal and navigate to the root folder (`woTeaT`).
2. Start the Vite development server:
   ```bash
   npm run dev
   ```

Your platform is now fully connected!
