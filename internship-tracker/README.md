# 🎓 InternIQ — AI-Powered Internship Tracker

A full-stack MERN application to track internship applications intelligently, with AI-generated email templates, analytics dashboards, dark mode, and JWT authentication.

![InternIQ Dashboard](https://via.placeholder.com/1200x600/3461f5/ffffff?text=InternIQ+Dashboard)

## ✨ Features

- 🔐 **JWT Authentication** — Secure register/login with protected routes
- 📋 **Application Management** — Add, edit, delete, bulk-delete applications
- 📊 **Analytics Dashboard** — Charts: status breakdown, monthly trends, funnel metrics
- 🤖 **AI Email Generator** — Claude AI generates follow-ups, thank-yous, networking emails
- 🌙 **Dark / Light / System Mode** — Persistent theme preference
- 🔍 **Filter & Search** — Filter by status, priority, keyword search
- 🏷️ **Tags & Notes** — Tag applications, add detailed notes and contacts
- 📅 **Deadline Tracking** — Track deadlines and follow-up dates
- 📱 **Responsive Design** — Mobile-first with collapsible sidebar

## 🛠 Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Recharts  |
| State     | Zustand                                 |
| Backend   | Node.js, Express.js                     |
| Database  | MongoDB + Mongoose                      |
| Auth      | JWT + bcryptjs                          |
| AI        | Anthropic Claude API                    |
| Routing   | React Router v6                         |

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or [Atlas](https://mongodb.com/atlas))
- Anthropic API key (for AI features, optional)

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/internship-tracker.git
cd internship-tracker
npm run install:all
```

### 2. Configure Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your values:
#   MONGO_URI=mongodb://localhost:27017/internship-tracker
#   JWT_SECRET=your_super_secret_key_min_32_chars
#   ANTHROPIC_API_KEY=sk-ant-your-key-here (optional)
```

### 3. Configure Frontend
```bash
cd frontend
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api (default, usually no change needed)
```

### 4. Run Development Servers
```bash
# From project root — runs both servers concurrently:
npm run dev

# Or separately:
npm run dev:backend   # http://localhost:5000
npm run dev:frontend  # http://localhost:5173
```

### 5. Open App
Visit **http://localhost:5173**, register a new account, and start tracking!

---

## 📁 Project Structure

```
internship-tracker/
├── backend/
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Register, login, profile
│   │   ├── applicationController.js  # CRUD + stats
│   │   └── aiController.js      # AI email generation
│   ├── middleware/
│   │   ├── auth.js              # JWT protect middleware
│   │   └── errorHandler.js      # Global error handler
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Application.js       # Application schema
│   ├── routes/
│   │   ├── auth.js
│   │   ├── applications.js
│   │   └── ai.js
│   ├── server.js                # Express app entry
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/            # ProtectedRoute, PublicRoute
│   │   │   ├── applications/    # ApplicationCard, ApplicationForm
│   │   │   ├── dashboard/       # StatCard
│   │   │   ├── layout/          # Sidebar
│   │   │   └── ui/              # Modal, Badges, Spinner, EmptyState
│   │   ├── context/
│   │   │   ├── authStore.js     # Zustand auth state
│   │   │   ├── appStore.js      # Zustand application state
│   │   │   └── themeStore.js    # Theme management
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ApplicationsPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── AIToolsPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   ├── utils/
│   │   │   ├── api.js           # Axios instance
│   │   │   └── constants.js     # Status colors, formatters
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── Dockerfile
├── docker-compose.yml
├── package.json                 # Root scripts
└── README.md
```

---

## 🔌 API Reference

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/password` | Change password |

### Applications
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/applications` | List all (with filters) |
| POST | `/api/applications` | Create application |
| GET | `/api/applications/:id` | Get single |
| PUT | `/api/applications/:id` | Update |
| DELETE | `/api/applications/:id` | Delete |
| GET | `/api/applications/stats` | Analytics data |
| DELETE | `/api/applications/bulk` | Bulk delete |

### AI
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/ai/email-template` | Generate email |
| POST | `/api/ai/insights` | Get AI insights |

---

## 🐳 Docker Deployment

```bash
# Create .env with JWT_SECRET and ANTHROPIC_API_KEY, then:
docker-compose up -d

# Backend runs at :5000, MongoDB at :27017
# Point frontend VITE_API_URL to your backend URL
```

## ☁️ Deploy to Render / Railway

### Backend
1. Create new Web Service → connect your GitHub repo
2. Build command: `cd backend && npm install`
3. Start command: `cd backend && npm start`
4. Add environment variables from `backend/.env.example`

### Frontend
1. Create new Static Site → connect repo
2. Build command: `cd frontend && npm install && npm run build`
3. Publish directory: `frontend/dist`
4. Add `VITE_API_URL=https://your-backend-url.render.com/api`

---

## 🤖 AI Features Setup

The AI email generator uses [Anthropic's Claude API](https://console.anthropic.com).

1. Get your API key at https://console.anthropic.com
2. Add to `backend/.env`: `ANTHROPIC_API_KEY=sk-ant-...`
3. Restart backend

Without the API key, the AI email feature will show an error but all other features work normally.

---

## 📝 License

MIT — free to use and modify.

---

Built with ❤️ using React, Express, MongoDB & Claude AI.
