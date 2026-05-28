import React, { useState, useCallback } from 'react'
import { simulateForecast } from '../utils/markovChain'
import ForecastTimeline from './ForecastTimeline'
import SummaryCards from './SummaryCards'

export default function ForecastTab({ data, stateColors, stateLabels, stateEmojis }) {
  const [days, setDays] = useState(7)
  const [forecast, setForecast] = useState(null)

  const handleSimulate = useCallback(() => {
    if (data.transitionMatrix && data.lastObservedState !== null) {
      const path = simulateForecast(data.lastObservedState, data.transitionMatrix, days)
      setForecast(path)
    }
  }, [data.transitionMatrix, data.lastObservedState, days])

  // Auto-simulate on mount or when days change
  React.useEffect(() => {
    handleSimulate()
  }, [handleSimulate])

  return (
    <div style={styles.container}>
      {/* Controls Section */}
      <div style={styles.controls}>
        <div style={styles.sliderGroup}>
          <label style={styles.label}>
            Forecast horizon: <strong>{days} days</strong>
          </label>
          <input
            type="range"
            min="7"
            max="30"
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            style={styles.slider}
          />
          <div style={styles.sliderLabels}>
            <span>7</span>
            <span>30</span>
          </div>
        </div>

        <button
          onClick={handleSimulate}
          style={styles.simulateButton}
        >
          ▶ Simulate
        </button>
      </div>

      {/* Forecast Timeline */}
      {forecast && (
        <div style={styles.section}>
          <h3 style={styles.heading}>Forecast Timeline</h3>
          <p style={styles.description}>
            Each simulation produces a different outcome. Click "Simulate" again to see an alternative forecast.
          </p>
          <ForecastTimeline
            forecast={forecast}
            stateColors={stateColors}
            stateLabels={stateLabels}
            stateEmojis={stateEmojis}
          />
        </div>
      )}

      {/* Summary Cards */}
      {forecast && (
        <div style={styles.section}>
          <h3 style={styles.heading}>Forecast Summary</h3>
          <SummaryCards
            forecast={forecast}
            stateColors={stateColors}
            stateLabels={stateLabels}
            stateEmojis={stateEmojis}
          />
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  controls: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '24px',
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-end',
    flexWrap: 'wrap'
  },
  sliderGroup: {
    flex: 1,
    minWidth: '250px'
  },
  label: {
    display: 'block',
    fontSize: '0.9rem',
    marginBottom: '12px',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  slider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
    outline: 'none',
    WebkitAppearance: 'none',
    appearance: 'none',
    marginBottom: '8px',
    '&::-webkit-slider-thumb': {
      appearance: 'none',
      WebkitAppearance: 'none',
      width: '18px',
      height: '18px',
      borderRadius: '50%',
      background: '#ffffff',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
    },
    '&::-moz-range-thumb': {
      width: '18px',
      height: '18px',
      borderRadius: '50%',
      background: '#ffffff',
      cursor: 'pointer',
      border: 'none',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
    }
  },
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.5)'
  },
  simulateButton: {
    padding: '10px 28px',
    background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontFamily: 'inherit',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)'
    }
  },
  section: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '24px'
  },
  heading: {
    fontSize: '1.3rem',
    fontWeight: 700,
    marginBottom: '8px'
  },
  description: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '20px',
    lineHeight: 1.5
  }
}
