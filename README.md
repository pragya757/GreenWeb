# 🌿 GreenWeb – Website Carbon Estimator

> **An academic project on Sustainable Computing and Green Computing**

GreenWeb helps users understand the environmental impact of websites by estimating their carbon emissions and providing actionable green optimisation recommendations.

---

## ⚠️ Important Disclaimer

GreenWeb is an **educational estimation tool**. All carbon and energy figures are **heuristic estimates**, not certified carbon measurements. They are:
- NOT suitable for regulatory reporting
- NOT an official industry certification
- NOT a substitute for a full lifecycle carbon assessment

Results are clearly labelled as *Directly Measured*, *Counted from HTML*, or *Estimated*.

---

## 📖 Problem Statement

The internet sector contributes significantly to global greenhouse gas emissions. Every webpage transfer involves data moving across networks, processed by servers, and rendered on devices — each step consuming energy. As web usage grows, the cumulative environmental impact is substantial. Yet most web developers have no visibility into the carbon footprint of the websites they build and maintain.

---

## 🎯 Objectives

1. Estimate the per-page-view carbon footprint of any public website
2. Provide transparent, labelled metrics (measured vs. estimated)
3. Generate data-driven, priority-ranked green optimisation recommendations
4. Enable tracking and comparison of multiple websites over time
5. Raise awareness of sustainable web development practices

---

## ✨ Features

- **Website Carbon Analyzer** – Safely fetch, parse, and estimate any public URL
- **Carbon Emission Estimation** – Transparent heuristic model (configurable parameters)
- **Environmental Score** – Project-defined heuristic score (0–100, not an industry standard)
- **Green Recommendations** – Threshold-triggered, non-generic, priority-ranked suggestions
- **Dashboard** – Charts, stats, and recent analysis overview
- **Analysis History** – Searchable, paginated history with delete support
- **PDF Report Download** – Downloadable report for each analysis
- **SSRF Protection** – Blocks private IPs, loopback, link-local, metadata endpoints
- **Responsive Design** – Mobile, tablet, and desktop friendly
- **Toast Notifications** – Real-time feedback on all user actions

---

## 🛠 Technology Stack

### Frontend
| Technology       | Purpose                              |
|------------------|--------------------------------------|
| React 18         | UI framework                         |
| Vite 5           | Build tool and dev server            |
| Tailwind CSS 3   | Utility-first styling                |
| React Router 6   | Client-side routing                  |
| Axios            | HTTP client for API calls            |
| Recharts         | Charts and data visualisation        |
| Lucide React     | Icon library                         |
| jsPDF            | PDF report generation                |

### Backend
| Technology       | Purpose                              |
|------------------|--------------------------------------|
| Python 3.9+      | Backend language                     |
| Flask 3          | Web framework / REST API             |
| Flask-CORS       | Cross-Origin Resource Sharing        |
| Flask-SQLAlchemy | ORM layer for SQLite                 |
| Requests         | SSRF-safe HTTP fetching              |
| BeautifulSoup4   | HTML parsing and resource counting   |
| SQLite           | Embedded relational database         |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│  React Frontend (Vite + Tailwind)   :5173               │
│  Landing │ Analyzer │ Results │ Dashboard │ History     │
└──────────────────────┬──────────────────────────────────┘
                       │ Axios HTTP (proxied)
┌──────────────────────▼──────────────────────────────────┐
│  Flask Backend  :5001                                   │
│                                                         │
│  POST /api/analyze      – Run analysis                  │
│  GET  /api/history      – List all analyses             │
│  GET  /api/history/:id  – Get single analysis           │
│  DELETE /api/history/:id– Delete analysis               │
│  GET  /api/dashboard    – Dashboard statistics          │
│  GET  /api/health       – Health check                  │
│                                                         │
│  ┌──────────────┐ ┌─────────────────┐ ┌─────────────┐  │
│  │ URL Validator│ │  Carbon Engine  │ │ Recommender │  │
│  │ (SSRF-safe)  │ │ (configurable)  │ │ (threshold) │  │
│  └──────────────┘ └─────────────────┘ └─────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │ SQLAlchemy ORM
┌──────────────────────▼──────────────────────────────────┐
│  SQLite  (greenweb.db)                                  │
│  Table: analysis                                        │
└─────────────────────────────────────────────────────────┘
```

---

## 🔬 Carbon Calculation Methodology

### What is Measured vs. Estimated

| Metric                  | Type           | How                                     |
|-------------------------|----------------|-----------------------------------------|
| HTML document size      | Directly Measured | Raw HTTP response body size           |
| Response time           | Directly Measured | Wall-clock time for HTTP response     |
| HTTP status code        | Directly Measured | HTTP response header                  |
| Image count             | Counted from HTML | `<img>` tag count                    |
| Script count            | Counted from HTML | `<script src>` tag count             |
| Stylesheet count        | Counted from HTML | `<link rel=stylesheet>` count        |
| External resources      | Counted from HTML | Cross-domain references              |
| Total transfer size     | **Estimated**  | HTML + heuristic per-resource averages  |
| Energy consumption      | **Estimated**  | Transfer × Energy intensity           |
| Carbon emissions        | **Estimated**  | Energy × Grid carbon intensity        |
| Environmental score     | **Heuristic**  | Project-defined penalty system        |

### Carbon Model (Simplified)

```
Step 1: Estimate Transfer Size (bytes)
  = HTML size + (images × 80KB) + (scripts × 40KB) + (CSS × 15KB) + (external × 10KB)

Step 2: Estimate Energy
  Energy (kWh) = Transfer (GB) × Energy Intensity (kWh/GB)
  Default Energy Intensity: 0.05 kWh/GB  ← ILLUSTRATIVE

Step 3: Estimate Carbon
  Carbon (gCO₂e) = Energy (kWh) × Carbon Intensity (gCO₂e/kWh)
  Default Carbon Intensity: 400 gCO₂e/kWh  ← ILLUSTRATIVE
```

> **Important:** These parameters are illustrative demonstration assumptions configurable in `backend/config.py`. They are NOT universal scientific constants.

### Environmental Score (0–100 Heuristic)

The score starts at 100 and is penalised based on:
- Carbon emissions level
- HTML document size
- Number of scripts
- Number of images
- Server response time

| Score Range | Category           |
|-------------|--------------------|
| 80–100      | Excellent          |
| 60–79       | Good               |
| 40–59       | Needs Improvement  |
| 0–39        | Poor               |

---

## 📁 Project Structure

```
greenweb/
├── .gitignore
├── README.md
│
├── backend/
│   ├── run.py                    # Flask entry point
│   ├── config.py                 # Configuration + carbon model parameters
│   ├── requirements.txt          # Python dependencies
│   └── app/
│       ├── __init__.py           # Application factory
│       ├── models/
│       │   └── analysis.py       # SQLAlchemy Analysis model
│       ├── routes/
│       │   ├── analysis.py       # POST /api/analyze
│       │   ├── history.py        # GET/DELETE /api/history
│       │   ├── dashboard.py      # GET /api/dashboard
│       │   └── health.py         # GET /api/health
│       ├── services/
│       │   ├── analyzer.py       # Website fetcher + HTML parser
│       │   ├── carbon_engine.py  # Carbon estimation model
│       │   └── recommender.py    # Recommendation generator
│       └── utils/
│           └── url_validator.py  # SSRF-safe URL validation
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── Toast.jsx
        │   └── RecommendationCard.jsx
        ├── pages/
        │   ├── LandingPage.jsx
        │   ├── AnalyzerPage.jsx
        │   ├── ResultsPage.jsx
        │   ├── DashboardPage.jsx
        │   ├── HistoryPage.jsx
        │   └── AboutPage.jsx
        ├── services/
        │   └── api.js            # Axios API client
        └── hooks/
            └── useToast.jsx      # Toast notification context
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** ≥ 18.x  (`node --version`)
- **Python** ≥ 3.9    (`python3 --version`)
- **npm** ≥ 9.x       (`npm --version`)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/greenweb.git
cd greenweb
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Start the Flask server (default port 5001)
python run.py
```

The backend will start at `http://localhost:5001`.

> **Note for macOS users:** Port 5000 is used by AirPlay Receiver. GreenWeb defaults to port 5001.

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the Vite dev server
npm run dev
```

The frontend will start at `http://localhost:5173`.

### 4. Open the Application

Navigate to **http://localhost:5173** in your browser.

---

## 📡 API Documentation

### `POST /api/analyze`

Analyse a website and estimate its carbon footprint.

**Request:**
```json
{ "url": "https://example.com" }
```

**Response (200):**
```json
{
  "id": 1,
  "website_url": "https://example.com",
  "analyzed_at": "2024-01-01T12:00:00",
  "html_size": 577,
  "response_time": 0.18,
  "http_status": 200,
  "image_count": 0,
  "script_count": 1,
  "stylesheet_count": 0,
  "external_resource_count": 0,
  "estimated_transfer_size": 41537.0,
  "energy_consumption": 0.00000193,
  "carbon_emissions": 0.000774,
  "environmental_score": 100.0,
  "performance_category": "Excellent",
  "recommendations": [...],
  "measurement_notes": {...},
  "model_assumptions": {...}
}
```

**Error (422):** Invalid/blocked URL  
**Error (502):** Unreachable website

---

### `GET /api/history`

List all analyses. Supports `?search=term&page=1&per_page=15`.

### `GET /api/history/:id`

Get a single analysis by ID.

### `DELETE /api/history/:id`

Delete an analysis by ID.

### `GET /api/dashboard`

Dashboard statistics including totals, averages, and score distribution.

### `GET /api/health`

Health check: `{"status": "ok"}`

---

## 🔒 Security Features (SSRF Protection)

The backend blocks requests to:
- `localhost` / `127.0.0.1` / `::1` (loopback)
- RFC-1918 private ranges: `10.x`, `172.16-31.x`, `192.168.x`
- Link-local: `169.254.x.x`
- IPv6 ULA: `fc::/7`, `fd::/8`
- AWS/GCP metadata endpoint: `169.254.169.254`
- Non-HTTP/HTTPS schemes
- Bare hostnames without dots

DNS resolution is validated for every request and re-validated on redirects.

---

## 🧪 Test Scenarios

| Test | Command / Action | Expected Result |
|------|-----------------|-----------------|
| Valid website | `POST /api/analyze {"url":"https://example.com"}` | 200 with analysis data |
| Invalid URL | `POST /api/analyze {"url":"not-a-url!"}` | 422 with error message |
| Private IP | `POST /api/analyze {"url":"http://192.168.1.1"}` | 422 SSRF blocked |
| Localhost | `POST /api/analyze {"url":"http://localhost:8080"}` | 422 SSRF blocked |
| Save & retrieve | Run analysis, then `GET /api/history` | Analysis appears |
| Delete | `DELETE /api/history/1` | 200 deleted |
| Dashboard stats | `GET /api/dashboard` | Aggregated stats |
| Health check | `GET /api/health` | `{"status":"ok"}` |

---

## ⚙️ Configuration

Edit `backend/config.py` to change model parameters:

```python
# Illustrative demonstration values — NOT scientific constants
ENERGY_INTENSITY_KWH_PER_GB = 0.05   # kWh per GB
CARBON_INTENSITY_G_PER_KWH  = 400.0  # gCO2e per kWh

# Heuristic resource size averages
BASE_IMAGE_SIZE_KB      = 80
BASE_SCRIPT_SIZE_KB     = 40
BASE_STYLESHEET_SIZE_KB = 15
```

Or use environment variables:
```bash
ENERGY_INTENSITY=0.06 CARBON_INTENSITY=350 PORT=5001 python run.py
```

---

---

## 🚀 Deployment on Render (Infrastructure as Code)

GreenWeb is fully configured for zero-configuration full-stack deployment on **[Render.com](https://render.com/)** using the included `render.yaml` Blueprint.

### Services Defined:
1. **`greenweb-api`** (Render Web Service):
   - Python / Flask backend executed via **Gunicorn** (`gunicorn run:app --bind 0.0.0.0:$PORT`)
   - Pre-configured CORS allowing requests from the frontend
   - Automated health checks at `/api/health`
2. **`greenweb-frontend`** (Render Static Site):
   - React + Vite SPA built via `npm install && npm run build`
   - Automated SPA rewrite rule (`/* -> /index.html`)
   - Automatically connected to the backend via `VITE_API_BASE` (`fromService.property: url`)

### Deployment Steps:
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **Blueprint**.
3. Select and connect your repository: `https://github.com/pragya757/GreenWeb`.
4. Render will parse `render.yaml` and display both services (`greenweb-api` and `greenweb-frontend`).
5. Click **Apply**. Render will automatically provision, build, and deploy both services!

---

## 💾 Database Persistence & Render Free Tier Notes

GreenWeb uses **SQLite** by default (`greenweb.db`), which requires zero setup:
- **Ephemeral Filesystem on Free Tier**: Render's free tier web services use an ephemeral disk. When the free service spins down after 15 minutes of inactivity or when a new deployment occurs, the filesystem is reset to the Git repository state. Any analyses run during the session will be reset upon restart.
- **Persistent Disk Option (Paid)**: To keep SQLite persistent, attach a Render Persistent Disk (e.g. mounted at `/var/data`) and set `DATABASE_URL=sqlite:////var/data/greenweb.db`.
- **Render PostgreSQL Option**: Alternatively, provision a Render PostgreSQL instance (or external PostgreSQL) and supply the connection string in the `DATABASE_URL` environment variable. SQLAlchemy supports both SQLite and PostgreSQL out-of-the-box with no code changes needed.

---

## ⚠️ Limitations

1. A simple HTTP fetch does not download all browser-rendered resources — sub-resource sizes are approximated
2. JavaScript-rendered content (SPAs, lazy loading) may not be captured
3. The carbon model uses illustrative defaults and does not account for renewable energy hosting
4. The environmental score is a project-defined heuristic, not an industry certification
5. Network-level energy is approximated, not measured
6. Results should not be used for regulatory reporting or ESG disclosures
7. SQLite database storage is ephemeral on Render Free Tier (see Database Persistence section above)

---

## 🔮 Future Enhancements

- [ ] Headless browser integration (Playwright/Puppeteer) for accurate resource measurement
- [ ] Renewable energy hosting detection (via Green Web Foundation API)
- [ ] Comparison view for two or more websites side-by-side
- [ ] Batch analysis mode (multiple URLs at once)
- [ ] Per-country carbon intensity lookup (Electricity Maps API)
- [ ] Historical trend charts per website
- [ ] Email report sharing
- [ ] Browser extension for real-time page carbon estimates

---

## 📜 Licence

This project is for academic purposes. No licence for commercial use.

---

*GreenWeb – Academic Project · Sustainable Computing · Green Computing*
