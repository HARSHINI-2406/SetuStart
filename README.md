# SetuStart - Governed Public Sector Innovation Procurement Platform

Developed by **InnoBridge Team**.

---

## 🌟 Project Overview

**SetuStart** is a transparent, AI-assisted, and governed public procurement platform that connects real government challenges with eligible startup solutions — enabling government departments to identify, pilot, procure, and scale innovative solutions from eligible startups.

### Core Journey & Principle
```
Government Department → Challenge Studio → Startup Discovery → Evaluation & Matching → Pilot Sandbox → Evidence Validation → Procurement & Scale
```
> **Core Principle**: AI assists. Rules evaluate. Humans decide. Evidence validates. Governance controls procurement.

---

## 🚀 Innovation Highlights (Key Modules)

1. **Eligibility Waiver Engine (Section 15a)**:
   - Rule-based waiver request workflow allowing early-stage startups failing rigid turnover/experience rules to submit justification (e.g. specialized IP). Reviewed and audited transparently.
2. **Independent Validator Role Segregation (Section 7 & 20a)**:
   - Strict DB-enforced constraint ensuring users who evaluated an application pre-pilot cannot act as independent validators for that pilot's evidence pack.
3. **Milestone Contracting & Payment SLA Engine (Section 20b & 28a)**:
   - Automated Payment SLA tracking flagging invoices overdue beyond the 7-day target SLA.
4. **Cross-Department Reuse Recommendation Engine (Section 21a)**:
   - Rule-based similarity engine automatically matching completed, scaled solutions with draft/open challenges from other departments.
5. **AI Transparency Ledger (Section 11 & 24a)**:
   - Every AI call (Gemini API proxy) logs full prompt/response pairs with human action history (accepted/modified/ignored).
6. **Public Transparency Portal (Section 22c)**:
   - Unauthenticated `/api/public/stats` endpoint exposing live, aggregate, non-sensitive platform metrics.
7. **Demand Radar (Section 26a)**:
   - Pipeline visibility into upcoming departmental demand categories prior to formal RFP release.
8. **Cross-Pilot Risk Heatmap (Section 20 & 27a)**:
   - Severity × Probability risk matrix plotting open risks across active pilot sandboxes.

---

## 🛠️ Stack & Technology

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React icons
- **Backend**: Python 3.11, FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic, PyJWT
- **Database**: PostgreSQL (with SQLite zero-config local fallback option)
- **AI Service**: Google Gemini API (proxied exclusively via FastAPI backend)
- **Containerization**: Docker & Docker Compose

---

## 👥 User Roles & Demo Login Credentials

All demo users share the default password: `password123`

| Role | Email | Key Capabilities |
| :--- | :--- | :--- |
| **Government Department** | `dept@gov.in` | Challenge Studio, Pilot Setup, Payment Approval, Procurement Submission |
| **Startup** | `startup@ecoclean.io` | Solution Profile, Challenge Application, Waiver Request, Invoicing |
| **Evaluator** | `evaluator@expert.gov.in` | Pre-pilot Application Scoring & Recommendation |
| **Independent Validator** | `validator@independent.org` | Post-pilot Evidence Audit & Validation (Conflict-of-interest protected) |
| **Administrator** | `admin@setustart.gov.in` | System Oversight, User Management, Payment SLA Monitoring, Cross-Dept Scale |

---

## 🏃 Running Locally

### Option A: Local Python & Node Execution (Zero Config)
1. **Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```
   *The database (`setustart.db`) auto-populates with realistic seed data on first run!*

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Access frontend at `http://localhost:3000` (API calls proxy automatically to `:8000`).*

### Option B: One-Command Docker Setup
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API Docs (Swagger): `http://localhost:8000/docs`
- Public Transparency Portal API: `http://localhost:8000/api/public/stats`

---

## 📁 Project Structure

```
SetuStart/
├── frontend/             # React + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/   # Navbar, Sidebar, StatusBadge, RiskHeatmap, PaymentSLA, AITransparencyModal
│   │   ├── context/      # AuthContext session provider
│   │   ├── pages/        # LandingPage, ChallengeStudio, EvaluationWorkspace, PilotSandbox, etc.
│   │   ├── services/     # Centralized REST API client
│   │   └── types/        # TypeScript interfaces
│   └── package.json
├── backend/              # Python FastAPI REST API
│   ├── app/
│   │   ├── core/         # Config, Security (HMAC/JWT), Database, Dependencies
│   │   ├── models/       # SQLAlchemy models for 28 entities
│   │   ├── routers/      # 22 API routers (auth, challenges, matching, pilots, waivers, etc.)
│   │   ├── services/     # AI proxy, Deterministic matching, Reuse engine, Seed service
│   │   └── main.py
│   └── requirements.txt
├── docker-compose.yml
└── README.md
```
