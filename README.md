# Bongo Laki - Full Stack Project

## Folder Structure
```
bongo-laki-project/
├── backend/          ← Node.js + Express + MongoDB
│   ├── server.js
│   ├── .env          ← DB credentials here
│   ├── models/
│   │   ├── Result.js
│   │   ├── Tip.js
│   │   └── Patti.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── results.js
│   │   ├── tips.js
│   │   └── patti.js
│   └── middleware/
│       └── auth.js
└── frontend/         ← React + Vite + Tailwind
    └── src/
        ├── pages/
        │   ├── HomePage.jsx
        │   ├── FreeTipsPage.jsx
        │   ├── PattiListPage.jsx
        │   ├── OldResultsPage.jsx
        │   └── AdminPage.jsx    ← Admin Dashboard
        ├── components/
        │   └── Header.jsx
        ├── data/constants.js
        ├── api.js
        └── App.jsx
```

## Setup

### Backend
```bash
cd backend
npm install
# Edit .env with your MongoDB URI if needed
npm run dev   # or: npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173
Backend runs on http://localhost:5000

## Admin Dashboard
- Access: In the browser, open console and run: `document.dispatchEvent(new CustomEvent('setTab', {detail:'Admin'}))`
- OR: Temporarily add "Admin" to the nav tabs in Header.jsx
- Default login: admin / bongolaki@admin123 (change in backend/.env)

## API Endpoints
- GET  /api/results/today   → Today's live result (public)
- GET  /api/results/old     → Last 30 results (public)
- GET  /api/tips/:date      → Tips for a date (public)
- GET  /api/patti           → Patti list (public)
- POST /api/auth/login      → Admin login
- POST /api/results         → Create/update result (admin)
- POST /api/tips            → Create/update tips (admin)
- PUT  /api/patti           → Update patti list (admin)
- DELETE /api/results/:id   → Delete result (admin)
- DELETE /api/tips/:id      → Delete tip (admin)
