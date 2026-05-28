# 🌦 Weather Markov Explorer — Build Specification

## Overview
Build a single-page React web application that fetches **live weather data** from the Open-Meteo API,
constructs a **discrete-time Markov chain** from the observed daily state sequences, and provides
two interactive experiences: an **Explore** view (model inspection) and a **Forecast** view
(stochastic simulation). The app targets curious non-expert users and explains concepts in plain language.

---

## Domain & Model Choice
- **Domain**: Weather patterns — accessible, visual, and relatable to any user.
- **Stochastic model**: Discrete-time Markov chain on 4 weather states.
- **Data source**: Open-Meteo public API (no API key required).

---

## Weather States
| ID | Emoji | Label | Rule |
|----|-------|-------|------|
| 0 | ☀️ | Sunny | cloud cover < 30% AND precip < 1mm |
| 1 | 🌤️ | Partly Cloudy | cloud cover 30–60% AND precip < 1mm |
| 2 | ☁️ | Cloudy | cloud cover > 60% AND precip < 1mm |
| 3 | 🌧️ | Rainy | precip ≥ 1mm (regardless of cloud cover) |

---

## Data Fetching
Use the Open-Meteo `/v1/forecast` endpoint:
```
https://api.open-meteo.com/v1/forecast
  ?latitude={LAT}
  &longitude={LON}
  &daily=precipitation_sum,cloudcover_mean
  &past_days=90
  &forecast_days=1
  &timezone=auto
```
Fetch 90 days of historical daily data to train the Markov chain.

### Cities to support (pre-set picker)
- New York (40.71, -74.01)
- London (51.51, -0.13)
- Tokyo (35.68, 139.69)
- Sydney (-33.87, 151.21)
- Miami (25.77, -80.19)
- Mumbai (19.08, 72.88)

---

## Markov Chain Mathematics

### 1. State Classification
```
classifyDay(cloudcover, precip):
  if precip >= 1  → state 3 (Rainy)
  if cloudcover < 30 → state 0 (Sunny)
  if cloudcover < 60 → state 1 (Partly Cloudy)
  else             → state 2 (Cloudy)
```

### 2. Transition Matrix Construction
Count all consecutive-day transitions in the 90-day sequence,
then row-normalise to probabilities. Result: a 4×4 matrix P
where P[i][j] = P(tomorrow = j | today = i).

### 3. Stationary Distribution
Power-iterate: start with uniform distribution π₀ = [0.25, 0.25, 0.25, 0.25],
apply π_{t+1} = π_t × P for 1000 iterations. Converges to the
long-run proportion of time spent in each state.

### 4. Forecast Simulation
Given a start state (last observed day), generate a random path of length N
by sampling the next state from the current row of P at each step.
Each run produces a different outcome — this is the stochastic nature of the model.

---

## UI Structure

### Layout
```
┌─────────────────────────────────────────┐
│  Header: title + subtitle               │
├─────────────────────────────────────────┤
│  City picker (pill buttons)             │
├─────────────────────────────────────────┤
│  Tab bar: [🔬 Explore Model] [📅 Forecast] │
├─────────────────────────────────────────┤
│  Tab content (see below)               │
└─────────────────────────────────────────┘
```

### Explore Tab
1. **Transition Matrix heatmap** (full width)
   - 4×4 grid with row/col labels
   - Each cell colored by destination state, opacity scaled to probability value
   - Diagonal cells highlighted (self-loops)
   - Plain-English explanation above the matrix

2. **Long-Run Distribution** (left half)
   - Bar chart (recharts BarChart) showing stationary distribution
   - Each bar colored by state
   - Plain-English explanation

3. **Last 30 Days** (right half)
   - 30 emoji tiles showing the actual classified weather sequence
   - Summary count per state below tiles

### Forecast Tab
1. **Controls**
   - Range slider: forecast horizon 7–30 days
   - "▶ Simulate" button (re-run produces different result)

2. **Forecast timeline**
   - Emoji tiles for each forecast day, labeled D1, D2, …, DN

3. **Summary cards**
   - 4 stat cards (one per state) showing count of days + percentage

---

## Visual Design

### Theme
Glassmorphism on a deep navy/midnight gradient background.

### Background
```css
background: linear-gradient(135deg, #020817, #0a1628, #091423);
```

### Glass cards
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 20px;
```

### Accent gradient (buttons, tabs, highlights)
```css
background: linear-gradient(90deg, #6366f1, #06b6d4);
```

### State color palette
| State | Color | RGB |
|-------|-------|-----|
| Sunny | #F59E0B | 245,158,11 |
| Partly Cloudy | #60A5FA | 96,165,250 |
| Cloudy | #94A3B8 | 148,163,184 |
| Rainy | #818CF8 | 129,140,248 |

### Typography
Font: `Syne` (Google Fonts, weights 400/700/800) with system-ui fallback.

---

## Technical Stack
- **Framework**: React 18 with hooks
- **Build tool**: Vite 5
- **Charting**: Recharts
- **Styling**: Inline styles (no CSS modules required)
- **Data**: fetch() → Open-Meteo REST API (no API key)
- **State management**: React useState / useCallback / useEffect

---

## Component Structure
```
App
├── City picker (inline)
├── Data fetching (useCallback + useEffect)
├── Tab bar (inline)
├── ExploreTab (inline or separate)
│   ├── TransitionMatrix
│   ├── StationaryDistributionChart
│   └── HistoryGrid
└── ForecastTab (inline or separate)
    ├── Controls (slider + button)
    ├── ForecastTimeline
    └── SummaryCards
```

---

## Containerisation

### Dockerfile (multi-stage)
- **Stage 1** (`builder`): `node:20-alpine`, install deps, `npm run build`
- **Stage 2** (`runner`): `nginx:1.25-alpine`, copy `/app/dist` → `/usr/share/nginx/html`
- Expose port 80

### nginx.conf
- SPA routing: `try_files $uri $uri/ /index.html`
- Gzip compression enabled
- Static asset cache: `expires 1y; Cache-Control: public, immutable`

---

## Kubernetes Manifests

### deployment.yaml
- Kind: `Deployment`
- Replicas: 2
- Image: `your-registry/weather-markov:latest`
- Container port: 80
- Resource requests: `cpu: 50m, memory: 64Mi`
- Resource limits: `cpu: 200m, memory: 128Mi`
- Liveness probe: `GET /` every 15s
- Readiness probe: `GET /` every 10s

### service.yaml
- Kind: `Service`, type `ClusterIP`
- Port 80 → targetPort 80

### ingress.yaml
- Kind: `Ingress`
- Host: `weather-markov.example.com`
- Path `/` → service `weather-markov:80`
- Annotation: `nginx.ingress.kubernetes.io/rewrite-target: /`

### hpa.yaml
- Kind: `HorizontalPodAutoscaler`
- Target: `weather-markov` Deployment
- Min replicas: 2 / Max replicas: 10
- Scale metric: CPU utilisation > 70%

---

## Deployment Commands
```bash
# Build & push image
docker build -t your-registry/weather-markov:latest .
docker push your-registry/weather-markov:latest

# Deploy to Kubernetes
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml

# Check rollout
kubectl rollout status deployment/weather-markov
kubectl get pods -l app=weather-markov
```

---

## Non-Goals
- No backend / server-side rendering
- No authentication
- No user-uploaded data (all data is live-fetched)
- No persistent storage
