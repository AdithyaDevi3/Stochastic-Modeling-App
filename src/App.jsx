import React, { useState, useEffect, useCallback } from 'react'
import { fetchWeatherData, classifyDay, buildTransitionMatrix, computeStationaryDistribution } from './utils/markovChain'
import ExploreTab from './components/ExploreTab'
import ForecastTab from './components/ForecastTab'
import CityPicker from './components/CityPicker'

const CITIES = {
  'New York': { lat: 40.71, lon: -74.01 },
  'London': { lat: 51.51, lon: -0.13 },
  'Tokyo': { lat: 35.68, lon: 139.69 },
  'Sydney': { lat: -33.87, lon: 151.21 },
  'Miami': { lat: 25.77, lon: -80.19 },
  'Mumbai': { lat: 19.08, lon: 72.88 }
}

const STATE_COLORS = {
  0: '#F59E0B', // Sunny
  1: '#60A5FA', // Partly Cloudy
  2: '#94A3B8', // Cloudy
  3: '#818CF8'  // Rainy
}

const STATE_LABELS = {
  0: 'Sunny',
  1: 'Partly Cloudy',
  2: 'Cloudy',
  3: 'Rainy'
}

const STATE_EMOJIS = {
  0: '☀️',
  1: '🌤️',
  2: '☁️',
  3: '🌧️'
}

export default function App() {
  const [selectedCity, setSelectedCity] = useState('New York')
  const [activeTab, setActiveTab] = useState('explore')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState({
    dailyStates: [],
    transitionMatrix: null,
    stationaryDistribution: null,
    lastObservedState: null
  })

  // Fetch and process weather data
  const loadWeatherData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const city = CITIES[selectedCity]
      const weatherData = await fetchWeatherData(city.lat, city.lon)
      
      // Classify each day into states
      const states = weatherData.map(day => 
        classifyDay(day.cloudcover_mean, day.precipitation_sum)
      )
      
      // Build transition matrix
      const transitionMatrix = buildTransitionMatrix(states)
      
      // Compute stationary distribution
      const stationaryDistribution = computeStationaryDistribution(transitionMatrix)
      
      // Get last observed state
      const lastObservedState = states[states.length - 1]
      
      setData({
        dailyStates: states,
        transitionMatrix,
        stationaryDistribution,
        lastObservedState
      })
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [selectedCity])

  // Load data on mount and when city changes
  useEffect(() => {
    loadWeatherData()
  }, [loadWeatherData])

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🌦 Weather Markov Explorer</h1>
        <p style={styles.subtitle}>Explore weather patterns and simulate stochastic forecasts</p>
      </div>

      {/* City Picker */}
      <CityPicker 
        cities={Object.keys(CITIES)}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
      />

      {/* Tab Bar */}
      <div style={styles.tabBar}>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'explore' ? styles.tabButtonActive : styles.tabButtonInactive)
          }}
          onClick={() => setActiveTab('explore')}
        >
          🔬 Explore Model
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'forecast' ? styles.tabButtonActive : styles.tabButtonInactive)
          }}
          onClick={() => setActiveTab('forecast')}
        >
          📅 Forecast
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {loading && <p style={styles.loading}>Loading weather data...</p>}
        {error && <p style={styles.error}>Error: {error}</p>}
        
        {!loading && !error && (
          <>
            {activeTab === 'explore' && (
              <ExploreTab 
                data={data}
                stateColors={STATE_COLORS}
                stateLabels={STATE_LABELS}
                stateEmojis={STATE_EMOJIS}
              />
            )}
            {activeTab === 'forecast' && (
              <ForecastTab
                data={data}
                stateColors={STATE_COLORS}
                stateLabels={STATE_LABELS}
                stateEmojis={STATE_EMOJIS}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    paddingBottom: '20px'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 800,
    marginBottom: '10px',
    background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  subtitle: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.7)'
  },
  tabBar: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    padding: '10px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    width: 'fit-content'
  },
  tabButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '16px',
    fontFamily: 'inherit',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  tabButtonActive: {
    background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
    color: '#ffffff'
  },
  tabButtonInactive: {
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.6)',
    '&:hover': {
      color: '#ffffff'
    }
  },
  content: {
    animation: 'fadeIn 0.3s ease-in'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '1.1rem',
    color: 'rgba(255, 255, 255, 0.7)'
  },
  error: {
    textAlign: 'center',
    padding: '20px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.5)',
    borderRadius: '12px',
    color: '#fca5a5'
  }
}
