# CommunityShare — Modern Community Resource-Sharing Platform 🌿

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.21-lightgrey.svg)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-v18.3-blue.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v7.0-47A248.svg)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-v4.8-black.svg)](https://socket.io/)

**CommunityShare** is a full-stack, cloud-ready community resource-sharing platform where neighbors borrow, lend, and rent unused household items, tools, camping equipment, cameras, and kitchen appliances.

Built with the aesthetic refinement of modern SaaS leaders (Linear, Notion, Airbnb), CommunityShare blends organic warmth—**forest greens**, **soft sage**, and **warm off-whites**—with fluid motion interactions, real-time messaging, and genuine database metrics.

---

## ✨ Core Features & Pages

| # | Page / Feature | Description |
|---|----------------|-------------|
| 1 | **Landing Page** | Animated hero with headline *"Share More. Own Less. Build Community."*, floating interactive resource cards, animated statistics counters (\$145k+ saved, 28+ tons CO₂ offset), category cards, "How It Works" guide, testimonials, and responsive footer. |
| 2 | **Authentication & 1-Click Demo** | Seamless registration and login with JWT tokens, password toggle, field validation, and **1-Click Demo Account Login** (Elena, Marcus, Sophia, David). |
| 3 | **User Dashboard** | Real database metrics: Items listed, active incoming/outgoing borrow requests, items currently borrowed/lent, real financial & carbon offset calculations, 6-month interactive activity trend chart, and action inboxes. |
| 4 | **Explore Marketplace** | Search by keyword/tag, category pills (Tools, Electronics, Sports Equipment, Kitchen Appliances, Books, Furniture, etc.), location search, price slider, availability and free-share filters, sort options, and responsive Grid/List views. |
| 5 | **Resource Details & Booking** | Multi-image gallery with thumbnail switcher, neighbor profile with verified badges, real-time ratings & aspect reviews, rules & conditions, and animated **Borrow Request Modal** with automatic day/deposit calculations and confetti celebration. |
| 6 | **Multi-Step Item Listing Wizard** | 4-step interactive wizard with progress bar: (1) Details & tags, (2) Sharing model (Free vs Rental rate) & security deposit, (3) Multi-image upload with instant preview thumbnails & guidelines, (4) Preview & Publish. |
| 7 | **Borrowing Requests Hub** | Dual tabs for **Incoming Requests** (approve/decline/confirm return) and **Outgoing Requests** (cancel/track status). Fully linked with real-time Socket.IO alerts. |
| 8 | **Real-Time Live Chat** | Socket.IO messaging with online status indicators, active typing indicators, unread message badges, message timestamps, and linked resource context header. |
| 9 | **My Items Management** | Manage active listings, view items currently borrowed or lent out, status toggles, and delete listing confirmation modal. |
| 10 | **Notification Center** | In-app notification bell with unread badge counter, real-time floating toast alerts on incoming requests/messages, mark all as read, and filter by unread. |
| ★ | **Wishlist / Favourites** | Save favorite resources with one click to plan future DIY or camping adventures. |
| ★ | **Community Reviews & Ratings** | Transparent neighbor ratings evaluating condition, punctuality, and communication. |

---

## 🎨 Visual Identity & Palette

* **Warm Off-White Background**: `#FBFBF9` / `#F4F3EE`
* **Forest Green Primary**: `#1E3A2F` / `#2C6450`
* **Soft Sage Green Secondary**: `#7E9F8B` / `#D1DEC3`
* **Charcoal Typography**: `#1F2421` / `#2D312E`
* **Subtle Neutral Grey Borders**: `#E5E7EB` / `#E6E5E0`
* **Accents**: Amber `#F4A261` and Emerald `#10B981`

---

## 🏗️ Architecture & Technology Stack

```
communityshare/
├── server/
│   ├── config/          # MongoDB connection & AWS S3 / Local upload config
│   ├── models/          # Mongoose models: User, Item, BorrowRequest, Message, Notification, Review
│   ├── routes/          # Express REST API routes: auth, items, requests, messages, notifications, reviews, stats
│   ├── middleware/      # JWT authentication verification & Multer multipart upload middleware
│   ├── sockets/         # Socket.IO real-time events handler & event emitters
│   ├── seeds/           # Rich realistic seed data and seeder runner script
│   └── server.js        # Express application entry point & static frontend production serving
├── client/
│   ├── src/
│   │   ├── components/  # Reusable UI components (Navbar, Footer, ItemCard, Modals, Badges, RatingStars)
│   │   ├── context/     # React Contexts: AuthContext, SocketContext, NotificationContext, WishlistContext
│   │   ├── pages/       # 11 complete pages
│   │   ├── services/    # Axios API service clients
│   │   ├── App.jsx      # React Router routing & ProtectedRoute wrappers
│   │   └── main.jsx     # Vite DOM mount
│   ├── index.html       # HTML entry point with Google Fonts (Plus Jakarta Sans & Inter)
│   ├── tailwind.config.js
│   └── vite.config.js
└── package.json         # Root scripts to orchestrate client and server
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Local daemon or MongoDB Atlas connection string)

### 1. Install Dependencies
```bash
# In server directory:
cd server
npm install

# In client directory:
cd ../client
npm install
```

### 2. Configure Environment Variables
Inside `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/communityshare
JWT_SECRET=communityshare_super_secret_jwt_key_2025_secure_and_random
JWT_EXPIRE=30d

# AWS S3 Configuration (Optional - falls back to local disk storage if omitted)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=communityshare-assets
```

### 3. Seed Database with Rich Realistic Data
```bash
cd server
npm run seed
```
This populates 4 neighborhood users, 12 items across all categories with high-definition Unsplash photography, active borrow requests, chat conversations, notifications, and reviews!

### 4. Run the Application
**Option A: Unified Server (Frontend + Backend on single port)**
```bash
# Build frontend once:
cd client && npm run build

# Start backend:
cd ../server && npm start
```
Open your browser to: **`http://localhost:5000`**

**Option B: Separate Dev Servers with Hot-Reloading**
```bash
# Terminal 1 (Backend API & WebSockets):
cd server && npm start

# Terminal 2 (Vite React Client with HMR):
cd client && npm run dev
```
Open your browser to: **`http://localhost:5173`** (API requests proxy automatically to port 5000).

---

## 👥 Demo Accounts (1-Click Login)

For instant evaluation, the login page features a **1-Click Instant Demo Testing** bar, or you can sign in manually with any of these pre-seeded accounts (password for all: `password123`):

1. **Elena Rostova** (`elena@communityshare.org`) — *Urban Gardener & Eco Advocate (Mission District)*
2. **Marcus Vance** (`marcus@communityshare.org`) — *DIY Woodworker & Maker (Hayes Valley)*
3. **Sophia Chen** (`sophia@communityshare.org`) — *Documentary Photographer & Hiker (Noe Valley)*
4. **David Miller** (`david@communityshare.org`) — *Audio Engineer & Weekend Chef (Sunset District)*

---

## ☁️ AWS S3 & Production Cloud Deployment

### AWS S3 Image Uploads
The application includes a dual-mode storage engine in `server/config/s3.js`:
1. If `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_S3_BUCKET` are set, images are streamed directly to AWS S3 using `@aws-sdk/client-s3` `PutObjectCommand` and public URLs are stored in MongoDB.
2. If credentials are not provided, images are stored locally in `server/uploads/` and served statically via Express.

### Deploying to AWS (ECS / App Runner / Elastic Beanstalk)
1. **Containerize**: Use standard Node.js alpine Dockerfile.
2. **Database**: Provision a free cluster on MongoDB Atlas and set `MONGODB_URI` in AWS Secrets Manager or Parameter Store.
3. **Environment**: Configure `JWT_SECRET`, `AWS_S3_BUCKET`, `AWS_REGION`.
4. **Build Step**: Run `npm run build` inside `client/` before starting `node server.js` so Express serves the SPA.

---

## 📡 Real-Time Socket.IO Events

- `join_user`: Joins user's private notification channel.
- `join_conversation`: Joins a live conversation room between two neighbors.
- `receive_message`: Emits live chat message to recipients.
- `user_typing` & `user_stop_typing`: Broadcasts live typing state in chat.
- `notification`: Delivers instant floating toast alerts for incoming borrow requests, request approvals, and new messages.
- `request_status_changed`: Updates counterparty request badge in real time.
- `online_users`: Tracks online presence.

---

## 📜 License
MIT License. Built with ❤️ for community abundance and zero-waste neighborhoods.
