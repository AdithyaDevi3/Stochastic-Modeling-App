import React from 'react'

export default function CityPicker({ cities, selectedCity, onCityChange }) {
  return (
    <div style={styles.container}>
      <p style={styles.label}>Select a city:</p>
      <div style={styles.pills}>
        {cities.map(city => (
          <button
            key={city}
            onClick={() => onCityChange(city)}
            style={{
              ...styles.pill,
              ...(selectedCity === city ? styles.pillActive : styles.pillInactive)
            }}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    marginBottom: '30px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '20px'
  },
  label: {
    fontSize: '0.9rem',
    marginBottom: '12px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: 600
  },
  pills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px'
  },
  pill: {
    padding: '8px 16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: 500
  },
  pillActive: {
    background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
    color: '#ffffff',
    border: '1px solid transparent'
  },
  pillInactive: {
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#ffffff'
    }
  }
}
