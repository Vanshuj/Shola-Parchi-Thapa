# Solah Parchi Thap (सोलह पर्ची थप)

**Play the classic, together.** A real-time multiplayer revival of the traditional Indian 16-chit parlor game, featuring a hand-crafted paper-and-ink nostalgic aesthetic, procedural Baithak audio synthesis, private customizable card labels, and full DPDP Act compliance.

---

## 🚀 Current Status & Quality Health

| Component | Status | Details |
| :--- | :--- | :--- |
| **Backend** | ![Build Status](https://img.shields.io/badge/Backend-Passing-success) | **30/30 tests passed** (Spring Boot 3.2, JUnit 5, MockMvc) |
| **Frontend** | ![Build Status](https://img.shields.io/badge/Frontend-Passing-success) | **14/14 tests passed** (Vitest, React Testing Library, ESLint passing) |
| **Production Build** | ![Vite Build](https://img.shields.io/badge/Vite%20Build-Passing-blue) | Optimized production bundle via `vite build` |
| **Database** | ![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-green) | MongoDB Atlas cloud integration verified |
| **Audio Engine** | ![Web Audio](https://img.shields.io/badge/Audio-Procedural%20WebAudio-orange) | Zero-external-file audio synthesis (THAP slap, Bansuri, Tanpura, Tabla) |
| **Compliance** | ![DPDP Act](https://img.shields.io/badge/Compliance-DPDP%20Act%20Ready-purple) | Cookie Consent, Age verification (13+), Privacy & Terms pages |

---

## 🎨 Key Features

- **Real-time 4-Player Multiplayer**: WebSocket (STOMP over SockJS) communication for low-latency passing and table slap (THAP!) arbitration.
- **Instant AI Bot Matches**: Jump into a game instantly with 1-click guest onboarding and AI companions ("Cautious Uncle", "Impulsive Chhotu", "Observant Dadi").
- **Private Deck Customization**: Handwrite custom deck labels (Raja-Rani, Bollywood villains, gully nicknames). Opponents only see folded blank parchment—labels render strictly on the owner's device.
- **Procedural Baithak Soundscape**: Authentic Indian ambient acoustics synthesized live via Web Audio API:
  - *Sound Effects*: Heavy THAP table slam, chit slide/flick, brass temple bell turn alerts, Dayan tabla countdown ticks, and cutting chai glass clinks.
  - *Continuous Music*: 4 meditative soundscapes (Raag Yaman Bansuri & Tanpura, Courtyard Monsoon Rain, 1970s Transistor Baithak, Morning Verandah).
- **Responsible Gaming & Privacy**: Strict non-gambling entertainment, DPDP Act consent banner, no dark patterns, and full terms & privacy policies.

---

## 🛠️ Tech Stack

- **Backend**: Java 17, Spring Boot 3.2, Spring Security + JWT (HS256), Spring WebSocket (STOMP), Spring Data MongoDB, Bucket4j rate limiting.
- **Frontend**: React 18, Vite 5, Tailwind CSS, Zustand state management, STOMP.js, Framer Motion, Lucide-style symbols.
- **Infrastructure**: Docker, Docker Compose, Nginx reverse proxy, GitHub Actions CI.

---

## 📁 Project Structure

```
solah-parchi-thap/
├── backend/                       # Spring Boot API & WebSocket server
│   ├── src/main/java/com/spt/    # Controllers, services, models, engine, AI
│   └── pom.xml
├── frontend/                      # React 18 Single-Page Application
│   ├── src/                       # Components, pages, stores, audio engine, WebSocket
│   ├── .eslintrc.cjs              # ESLint configuration
│   └── vite.config.js
├── docker-compose.yml             # Full-stack container orchestration
├── .env.example                   # Environment configuration template
└── README.md
```

---

## 💻 Running Locally

### ⚡ Quick Start: One Command (Full Stack)

Run both the Spring Boot backend and React frontend concurrently with automatic `.env` loading:

```powershell
npm start
```
*(or `npm run dev`, `node run.js`, `.\run.bat`, or `.\run.ps1`)*

- **Frontend**: **http://localhost:8000**
- **Backend API**: **http://localhost:8080**
- Press `Ctrl + C` at any time to gracefully stop both servers.

---

### Prerequisites
- **Java**: JDK 17 or higher (`java -version`)
- **Node.js**: v18+ and npm (`node -v`, `npm -v`)
- **MongoDB**: MongoDB Atlas (configured in `.env`) or local MongoDB on port `27017`

---

### Manual Multi-Terminal Mode (Optional)

#### Step 1: Start Backend (Terminal 1)

```powershell
cd backend

# Option A: Connect to MongoDB Atlas (or your own cloud URI)
$env:MONGO_URI="mongodb+srv://vanshikacvjain_db_user:MGG6fsM7TlPTFmgj@sholachit.l9wmcbk.mongodb.net/solah_parchi_thap?retryWrites=true&w=majority"
$env:JWT_SECRET="solah-parchi-thap-local-dev-jwt-secret-key-32-chars"
.\mvnw.cmd spring-boot:run

# Option B: Connect to local MongoDB (localhost:27017)
.\mvnw.cmd spring-boot:run
```
> Backend runs at: **http://localhost:8080**  
> Health check: **http://localhost:8080/actuator/health**

---

### Step 2: Start Frontend (Terminal 2)

```powershell
cd frontend
npm install
npm run dev
```
> Frontend dev server runs at: **http://localhost:8000**  
> Automatically proxies `/api` and `/ws` to the backend.

---

## 🐳 Running with Docker Compose

To run the entire stack (Frontend, Backend, and MongoDB) inside containers:

```bash
cp .env.example .env
docker compose up --build
```
- **Web App**: http://localhost:3000
- **API**: http://localhost:8080
- **Stop services**: `docker compose down`

---

## 🧪 Testing & Validation

```powershell
# 1. Run all backend tests (30 integration & unit tests)
cd backend
.\mvnw.cmd test

# 2. Run all frontend unit tests (14 Vitest tests)
cd frontend
npm run test

# 3. Verify linting (0 errors)
npm run lint

# 4. Production build validation
npm run build
```

---

## 🚢 Deployment Guide

### Deploy to Render / Railway (Backend) & Vercel / Netlify (Frontend)

1. **Backend (Render / Railway)**:
   - Root Directory: `backend`
   - Build Command: `./mvnw clean package -DskipTests`
   - Start Command: `java -jar target/solah-parchi-thap.jar`
   - Environment Variables:
     - `SPRING_PROFILES_ACTIVE=prod`
     - `PORT=8080`
     - `MONGO_URI=<your-mongodb-atlas-uri>`
     - `JWT_SECRET=<min-32-character-secret>`
     - `CORS_ORIGIN=https://<your-frontend-domain>`

2. **Frontend (Vercel / Netlify)**:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables:
     - `VITE_API_BASE_URL=https://<your-backend-domain>/api/v1`
     - `VITE_WS_URL=https://<your-backend-domain>/ws`

---

## 🔒 Security & Privacy

- **Stateless Authentication**: BCrypt (cost factor 12) + HS256 JWT tokens with 24-hour expiration.
- **Client-Side Privacy Boundary**: Card labels are strictly private to each player and never serialized to opponent payloads.
- **Rate Limiting**: Bucket4j token bucket rate limiting (10 requests/sec per token/IP).
- **DPDP Act & ePrivacy Compliance**: Explicit cookie consent banner, non-gambling certified rules, age verification, and data retention policies.

---

## 📜 License

MIT License. Designed with love and nostalgia for Indian drawing rooms and verandahs.
