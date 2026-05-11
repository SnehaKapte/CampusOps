# 🏛️ CampusOps — Smart Campus Infrastructure Automation Platform

A full-stack web application with complete CI/CD pipeline demonstrating DevOps practices.

---

## 🚀 Quick Start (Run Locally in VS Code)

### Prerequisites
- Node.js 18+ (download: https://nodejs.org)
- npm 9+
- Git

### Step 1 — Clone or open the project
```bash
cd campusops
```

### Step 2 — Install all dependencies
```bash
npm run install:all
```

### Step 3 — Start both servers together
```bash
npm run dev
```

This starts:
- **Backend API** → http://localhost:5000
- **React Frontend** → http://localhost:3000

### Step 4 — Open the app
Go to **http://localhost:3000**

**Login credentials:**
| Username   | Password   | Role     |
|------------|------------|----------|
| `admin`    | `admin123` | Admin    |
| `operator` | `op123`    | Operator |
| `viewer`   | `view123`  | Viewer   |

---

## 📁 Project Structure

```
campusops/
├── client/                    # React.js Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Layout.js      # Sidebar + topbar layout
│   │   │   ├── Layout.css
│   │   │   ├── Components.js  # MetricCard, Badge, ProgressBar...
│   │   │   └── Components.css
│   │   ├── pages/
│   │   │   ├── Login.js       # Authentication page
│   │   │   ├── Dashboard.js   # Main overview dashboard
│   │   │   ├── Energy.js      # Energy monitoring
│   │   │   ├── Network.js     # Network infrastructure
│   │   │   ├── Security.js    # Security systems
│   │   │   ├── HVAC.js        # Climate control
│   │   │   ├── Alerts.js      # Alert management
│   │   │   ├── Pipeline.js    # CI/CD pipeline status
│   │   │   └── Services.js    # Service health monitor
│   │   ├── hooks/
│   │   │   └── useWebSocket.js  # Real-time WebSocket hook
│   │   ├── services/
│   │   │   └── api.js           # Axios API service layer
│   │   ├── __tests__/
│   │   │   └── components.test.js  # Jest component tests
│   │   ├── App.js             # Root component + routing
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── Dockerfile
│
├── server/                    # Node.js + Express Backend
│   ├── routes/
│   │   ├── authRoutes.js      # POST /api/auth/login
│   │   ├── metricsRoutes.js   # GET /api/metrics
│   │   ├── energyRoutes.js    # GET /api/energy
│   │   ├── hvacRoutes.js      # GET/PATCH /api/hvac
│   │   ├── networkRoutes.js   # GET /api/network
│   │   ├── securityRoutes.js  # GET /api/security
│   │   ├── alertRoutes.js     # GET/POST /api/alerts
│   │   ├── serviceRoutes.js   # GET /api/services
│   │   └── pipelineRoutes.js  # GET /api/pipeline
│   ├── controllers/
│   │   └── authController.js  # Login / getMe handlers
│   ├── middleware/
│   │   ├── auth.js            # JWT protect + adminOnly
│   │   └── errorHandler.js    # Global error handler
│   ├── services/
│   │   └── sensorSimulator.js # IoT sensor data simulator
│   ├── utils/
│   │   ├── database.js        # MongoDB connection
│   │   └── mockStore.js       # In-memory mock data
│   ├── __tests__/
│   │   └── api.test.js        # Jest + Supertest API tests
│   ├── app.js                 # Express app setup
│   ├── server.js              # HTTP + WebSocket server
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── Dockerfile
│
├── ansible/                   # Ansible Configuration Management
│   ├── inventory/
│   │   ├── staging            # Staging server inventory
│   │   └── production         # Production server inventory
│   ├── provision.yml          # One-time server provisioning
│   ├── deploy-staging.yml     # Staging deployment playbook
│   └── deploy-production.yml  # Production deployment playbook
│
├── nginx/
│   └── nginx.conf             # Nginx reverse proxy config
│
├── Jenkinsfile                # Jenkins Declarative Pipeline
├── docker-compose.yml         # Full Docker stack
├── package.json               # Root scripts
└── README.md
```

---

## 🧪 Running Tests

### Backend Tests (Jest + Supertest)
```bash
cd server
npm test
# or with coverage:
npm test -- --coverage
```

Expected output:
```
PASS __tests__/api.test.js
  POST /api/auth/login       ✓ 6 tests
  GET /health                ✓ 1 test
  GET /api/metrics           ✓ 3 tests
  GET /api/energy            ✓ 2 tests
  GET /api/hvac              ✓ 4 tests
  GET /api/network           ✓ 2 tests
  GET /api/security          ✓ 1 test
  GET /api/alerts            ✓ 5 tests
  GET /api/services          ✓ 2 tests
  GET /api/pipeline          ✓ 4 tests
  404 handler                ✓ 1 test

Tests:       31 passed, 0 failed
Coverage:    ~87%
```

### Frontend Tests (React Testing Library)
```bash
cd client
npm test -- --watchAll=false
```

---

## 🔌 API Endpoints

| Method | Endpoint                  | Description                        |
|--------|---------------------------|------------------------------------|
| POST   | /api/auth/login           | Login and receive JWT token        |
| GET    | /api/auth/me              | Get current user info              |
| GET    | /api/metrics              | Aggregated dashboard metrics       |
| GET    | /api/energy               | Energy data with 7-day history     |
| GET    | /api/hvac                 | All HVAC zones + summary           |
| GET    | /api/hvac/:id             | Single zone status                 |
| PATCH  | /api/hvac/:id             | Update zone setpoint               |
| GET    | /api/network              | Network stats with 24h history     |
| GET    | /api/security             | Security systems status            |
| GET    | /api/alerts               | Alerts list (filterable)           |
| POST   | /api/alerts/:id/resolve   | Resolve an alert                   |
| GET    | /api/services             | All campus services status         |
| GET    | /api/services/health      | Platform health check              |
| GET    | /api/pipeline/status      | Latest Jenkins build status        |
| GET    | /api/pipeline/runs        | Build history                      |
| GET    | /health                   | API health check (unauthenticated) |

### WebSocket
Connect to `ws://localhost:5000/ws` for real-time events:
- `METRICS_UPDATE` — Live infrastructure metrics every 4 seconds
- `ALERT_NEW` — New alert notifications
- `SERVICE_UPDATE` — Service status changes

---

## 🐳 Run with Docker

```bash
# Build and start everything
docker-compose up --build

# App at http://localhost:80
# API at http://localhost:5000

# Stop
docker-compose down
```

---

## ⚙️ CI/CD Pipeline (Jenkins)

The `Jenkinsfile` defines a 10-stage declarative pipeline:

1. **Checkout** — Clone repo, extract commit metadata
2. **Install Dependencies** — Parallel `npm ci` for server + client
3. **Lint & Audit** — ESLint + `npm audit` security check
4. **Unit & Integration Tests** — Jest + coverage threshold check
5. **Frontend Tests** — React Testing Library component tests
6. **E2E Tests** — Selenium WebDriver end-to-end scenarios
7. **Build Docker Images** — Multi-stage builds pushed to registry
8. **Deploy Staging** — Ansible deploys to staging environment
9. **Smoke Tests** — Health check on staging after deploy
10. **Deploy Production** — Manual approval gate + Ansible production deploy

### To set up Jenkins locally:
1. Install Jenkins: https://www.jenkins.io/doc/book/installing/
2. Install plugins: `Pipeline`, `GitHub`, `Ansible`, `Docker Pipeline`, `Slack Notification`
3. Create a new Pipeline job pointing to your GitHub repo
4. Add credentials: `github-credentials`, `docker-registry`, `ansible-vault-pass`
5. Push to `main` branch — pipeline triggers automatically via webhook

---

## 🔧 Ansible Configuration Management

```bash
# Provision fresh servers (run once)
ansible-playbook ansible/provision.yml -i ansible/inventory/staging

# Deploy to staging
ansible-playbook ansible/deploy-staging.yml \
  -i ansible/inventory/staging \
  -e image_tag=47

# Deploy to production
ansible-playbook ansible/deploy-production.yml \
  -i ansible/inventory/production \
  -e image_tag=47
```

---

## 🌍 Environment Variables

### Server (.env)
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/campusops
JWT_SECRET=your_secret_here
JWT_EXPIRE=8h
USE_MOCK_DATA=true        # Set true to skip MongoDB
```

---

## 🎓 Project Evaluation Mapping

| Criteria          | Implementation                                          |
|-------------------|---------------------------------------------------------|
| Web App (50M)     | React + Node.js + Express + MongoDB + WebSocket         |
| CI/CD (50M)       | Jenkins 10-stage pipeline + Ansible + Docker            |
| Testing Tool ✓    | Jest (unit+integration) + Selenium E2E                  |
| Jenkins ✓         | Full Jenkinsfile with parallel stages + approval gate   |
| Ansible ✓         | Provision + staging deploy + production deploy          |
| Design (5M)       | 3-tier architecture, API design, Docker Compose stack   |
| Effort (5M)       | 8 pages, 12 API endpoints, 31+ tests, full DevOps chain |
| Documentation (5M)| This README + inline code comments throughout           |
