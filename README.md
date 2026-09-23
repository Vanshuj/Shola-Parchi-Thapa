# Solah Parchi Thap

**Play the classic, together.** A real-time multiplayer revival of the traditional
Indian 16-chit card game, with a hand-crafted paper-and-ink nostalgic aesthetic and
fully private, user-customizable card labels.

- Backend: Java 17, Spring Boot 3.2, Spring WebSocket (STOMP/SockJS), Spring Security + JWT, Spring Data MongoDB
- Frontend: React 18 + TypeScript, Vite, Tailwind CSS, Zustand, STOMP.js, Framer Motion

## Project layout

```
solah-parchi-thap/
├── backend/   # Spring Boot API + WebSocket server
├── frontend/  # React + TS single-page app
└── docker-compose.yml
```

## First-time setup

1. Copy the env file and fill in a real JWT secret (32+ chars):
   ```bash
   cp .env.example .env
   ```
2. Ensure MongoDB is running locally on port 27017 (or configure `MONGO_URI` in `.env`).
3. There is no pre-seeded user; register your own via the API or the Signup page.

## Run locally WITHOUT Docker

**Backend** (connects to MongoDB on `localhost:27017`):
```bash
cd backend
./mvnw spring-boot:run
# or: mvn spring-boot:run
```
Backend starts on http://localhost:8080 and connects to MongoDB database `solah_parchi_thap`.

**Frontend** (in a second terminal):
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Frontend starts on http://localhost:8000 and proxies `/api` and `/ws` to the backend.

## Run locally WITH Docker Compose

```bash
cp .env.example .env   # edit JWT_SECRET first
docker compose up --build
```
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- MongoDB: localhost:27017

Stop with `docker compose down` (add `-v` to also drop the MongoDB volume).

## Running tests

```bash
# Backend
cd backend && mvn test

# Frontend unit tests
cd frontend && npm run test

# Frontend E2E (requires a live backend + frontend; see e2e/full-game.spec.ts)
cd frontend && E2E_BACKEND_URL=http://localhost:8080 npm run e2e
```

## curl walkthrough: register → login → create room

```bash
# Register
curl -s -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"riya","email":"riya@example.com","password":"password123"}'

# Login (grab the "token" field from the response)
TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"riya@example.com","password":"password123"}' | python3 -c "import sys,json;print(json.load(sys.stdin)['token'])")

# Create a room
curl -s -X POST http://localhost:8080/api/v1/rooms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"maxPlayers":4,"isPrivate":true}'
```

## Notes on nostalgic sound assets

`frontend/src/utils/soundManager.ts` points at placeholder file paths under
`/public/sounds/`. Before shipping, source and drop in royalty-free audio for:
chalk writing, paper rustle, card flip, an old-radio ambient loop, a victory
shehnai flourish, and a last-5-seconds tabla tick — then update the paths if
you rename the files. Freesound.org (CC0/CC-BY) is a reasonable starting point;
check each license before distribution.

## Security notes

- BCrypt cost 12, JWT HS256 (24h expiry, secret from env), stateless sessions
- CORS restricted to `CORS_ORIGIN`; CSRF disabled since auth is bearer-token-only
- Bucket4j rate limiting: 10 requests/sec per bearer token (or IP if unauthenticated)
- Card labels are validated and sanitized server-side (`LabelValidator`) regardless
  of client-side checks, and are never sent to any player but their owner —
  see `GameService#buildDtoFor` for the privacy boundary.

## Known scope notes

- The emoji picker ships a small offline glyph grid rather than the full
  `emoji-mart` data pack, to avoid a network fetch at runtime; swap in the full
  picker if you want the complete emoji set.
- This was generated in a sandboxed environment without access to Maven Central
  or the full npm registry, so `mvn verify` / `npm install` have not been executed
  here — run them locally as the first step to catch any dependency-resolution
  issues before deploying.
