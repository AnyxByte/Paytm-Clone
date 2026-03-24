# PayTm-Clone — Peer-to-Peer Payment App

A full-stack P2P payment application based on Paytm. Users can create wallets, deposit money via Razorpay, transfer money to other users, and withdraw funds — all backed by a double-entry ledger system.

---

## Features

- **User Authentication** — Signup, login with JWT-based auth and protected routes
- **Wallet Creation** — Each user can create a wallet tied to their account
- **Deposit Funds** — Add money to wallet via Razorpay payment gateway (UPI, Card, Net Banking)
- **P2P Transfers** — Send money instantly to any PayTm user ...
- **Withdraw Funds** — Simulate withdrawal from wallet back to bank
- **Transaction History** — View all past deposits, transfers and withdrawals
- **Double Entry Ledger** — Every transaction creates corresponding debit/credit ledger entries
- **Idempotency** — Duplicate transactions are safely handled
- **Atomic Transactions** — MongoDB sessions ensure no partial updates

---

## Tech Stack

**Frontend**
- Next.js 14 
- Tailwind CSS
- Axios
- React Context API
- js-cookie

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- Razorpay SDK
- JSON Web Tokens (JWT)
- Crypto (signature verification)

**Infrastructure**
- MongoDB Atlas (Database)
- Render (Backend hosting)
- Vercel (Frontend hosting)

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Razorpay account (test mode)

---

### 1. Clone the repository

```bash
git clone https://github.com/AnyxByte/Paytm-Clone.git
```

---

### 2. Backend Setup

```bash
cd paytm-server
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=3001
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_SECRET_KEY=xxxxxxxxxx
ADMIN_ACCOUNTID=mongodb_id_of_system_account(basically you have to login and make it system user and create the account , so that account._id will be admin_accountId)
```

Start the backend:

```bash
# development
npm run dev

# production
npm start
```

---

### 3. Frontend Setup

```bash
cd paytm-client
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

Start the frontend:

```bash
npm run dev
```

---

### 4. Open the app

```
Frontend → http://localhost:3000
Backend  → http://localhost:3001
```
---
