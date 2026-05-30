# Weather Markov Explorer - Complete Build

## ✅ Project Overview

A single-page React web application that fetches live weather data from the Open-Meteo API, constructs a discrete-time Markov chain from 90 days of historical weather, and provides interactive experiences to explore and forecast weather patterns.

---

## 📁 Project Structure

```
Stochastic-Modeling-App/
├── package.json                 # Node.js dependencies
├── vite.config.js              # Vite build configuration
├── index.html                  # HTML entry point
├── Dockerfile                  # Multi-stage Docker build
├── nginx.conf                  # Nginx SPA configuration
├── src/
│   ├── main.jsx               # React app entry point
│   ├── index.css              # Global styles
│   ├── App.jsx                # Main app component
│   ├── utils/
│   │   └── markovChain.js    # Markov chain math utilities
│   └── components/
│       ├── CityPicker.jsx           # City selection
│       ├── ExploreTab.jsx           # Model exploration view
│       ├── TransitionMatrix.jsx     # Heatmap visualization
│       ├── StationaryDistributionChart.jsx  # Bar chart
│       ├── HistoryGrid.jsx          # Last 30 days timeline
│       ├── ForecastTab.jsx          # Forecast view
│       ├── ForecastTimeline.jsx     # Forecast tiles
│       └── SummaryCards.jsx         # Statistics cards
└── k8s/
    ├── deployment.yaml       # Kubernetes deployment
    ├── service.yaml         # Service definition
    ├── ingress.yaml         # Ingress routing
    └── hpa.yaml            # Horizontal Pod Autoscaler
```

---

## 🚀 Getting Started

### Local Development

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

3. **Build for production:**
   ```bash
   npm run build
   ```
   Output will be in the `dist/` directory.

### Docker Deployment

1. **Build the Docker image:**

   ```bash
   docker build -t your-registry/weather-markov:latest .
   ```

2. **Push to container registry:**

   ```bash
   docker push your-registry/weather-markov:latest
   ```

3. **Run locally:**
   ```bash
   docker run -p 80:80 your-registry/weather-markov:latest
   ```

### Kubernetes Deployment

1. **Update image reference** in `k8s/deployment.yaml`

2. **Deploy to cluster:**

   ```bash
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   kubectl apply -f k8s/ingress.yaml
   kubectl apply -f k8s/hpa.yaml
   ```

3. **Verify deployment:**
   ```bash
   kubectl rollout status deployment/weather-markov
   kubectl get pods -l app=weather-markov
   ```

---

## 🎨 Features

### Explore Tab

- **Transition Matrix Heatmap**: Interactive 4×4 matrix showing state transition probabilities
- **Long-Run Distribution**: Bar chart of the stationary distribution
- **30-Day History**: Visual timeline of actual observed weather states

### Forecast Tab

- **Adjustable Horizon**: Slider to set forecast length (7-30 days)
- **Stochastic Simulation**: Generate different forecasts by clicking "Simulate"
- **Forecast Timeline**: Visual emoji tiles for predicted weather
- **Summary Statistics**: Count and percentage breakdown of forecasted states

### Supported Cities

- New York
- London
- Tokyo
- Sydney
- Miami
- Mumbai

---

## 🧮 Markov Chain Model

### Weather States

| State | Emoji | Condition                                       |
| ----- | ----- | ----------------------------------------------- |
| 0     | ☀️    | Sunny (cloud < 30%, precip < 1mm)               |
| 1     | 🌤️    | Partly Cloudy (30% ≤ cloud < 60%, precip < 1mm) |
| 2     | ☁️    | Cloudy (cloud ≥ 60%, precip < 1mm)              |
| 3     | 🌧️    | Rainy (precip ≥ 1mm)                            |

### Key Algorithms

1. **State Classification**: Rules-based classification from cloud cover and precipitation
2. **Transition Matrix**: Row-normalized count matrix from consecutive day transitions
3. **Stationary Distribution**: Power iteration (1000 cycles) from uniform starting distribution
4. **Forecast Simulation**: Random walk sampling from transition probabilities

---

## 🎨 Visual Design

- **Background**: Deep navy gradient (`#020817` → `#0a1628` → `#091423`)
- **Glassmorphism**: Semi-transparent cards with blur effect
- **Accent Gradient**: Indigo to cyan (`#6366f1` → `#06b6d4`)
- **Typography**: Syne font (400/700/800 weights) with system fallback
- **State Colors**:
  - Sunny: `#F59E0B` (amber)
  - Partly Cloudy: `#60A5FA` (blue)
  - Cloudy: `#94A3B8` (slate)
  - Rainy: `#818CF8` (indigo)

---

## 🔧 Technical Stack

- **Framework**: React 18 with hooks
- **Build Tool**: Vite 5
- **Charting**: Recharts 2
- **Styling**: Inline styles (no CSS-in-JS framework)
- **HTTP**: Native `fetch()` API
- **State Management**: React hooks (useState, useEffect, useCallback)
- **Containerization**: Docker + Nginx
- **Orchestration**: Kubernetes with autoscaling

---

## 📊 Data Flow

```
Open-Meteo API (90 days historical)
         ↓
Weather Data (cloud cover + precipitation)
         ↓
State Classification (0-3)
         ↓
Transition Matrix Computation
         ↓
Stationary Distribution Calculation
         ↓
UI Display + Forecast Simulation
```

---

## 🔌 API Integration

- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **No authentication required**
- **Parameters**: latitude, longitude, daily metrics, past_days, timezone
- **Data**: 90 days historical + 1 day current forecast

---

## 📦 Dependencies

### Production

- `react@^18.2.0` - UI framework
- `react-dom@^18.2.0` - DOM rendering
- `recharts@^2.10.0` - Chart components

### Development

- `vite@^5.0.0` - Build tool
- `@vitejs/plugin-react@^4.0.0` - React plugin for Vite
- `@types/react@^18.2.0` - TypeScript types
- `@types/react-dom@^18.2.0` - React DOM types

---

## 🚢 Deployment Options

1. **Static Hosting** (Netlify, Vercel, CloudFlare Pages): Deploy `dist/` folder directly
2. **Docker Compose**: Local multi-container testing
3. **Kubernetes**: Production-grade orchestration with auto-scaling
4. **Traditional VPS**: Copy `dist/` to web server, configure nginx

---

## 📈 Kubernetes Resources

- **Min Replicas**: 2 pods
- **Max Replicas**: 10 pods (with CPU scaling at 70%)
- **Resource Requests**: 50m CPU, 64Mi memory per pod
- **Resource Limits**: 200m CPU, 128Mi memory per pod
- **Probes**: Liveness (15s) and Readiness (10s) checks

---

## ✨ Features Implemented

✅ Live weather data fetching  
✅ Markov chain construction from historical data  
✅ Interactive transition matrix visualization  
✅ Stationary distribution calculation  
✅ 30-day historical weather timeline  
✅ Stochastic weather forecasting  
✅ Responsive UI with glassmorphism design  
✅ City picker with 6 preset locations  
✅ Multi-day forecast with adjustable horizon  
✅ Statistical summary cards  
✅ Docker containerization  
✅ Kubernetes manifests with auto-scaling  
✅ Nginx SPA routing and caching

---

## 🎯 Next Steps

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Build for production: `npm run build`
4. Deploy to Docker/Kubernetes as needed

Enjoy exploring weather patterns through Markov chains! 🌦️
