import React from 'react'

export default function ForecastTimeline({ forecast, stateColors, stateLabels, stateEmojis }) {
  return (
    <div style={styles.container}>
      <div style={styles.timeline}>
        {forecast.map((state, i) => (
          <div key={`forecast-day-${i}`} style={styles.day}>
            <div
              style={{
                ...styles.tile,
                background: stateColors[state]
              }}
              title={`D${i + 1}: ${stateLabels[state]}`}
            >
              <span style={styles.emoji}>{stateEmojis[state]}</span>
            </div>
            <div style={styles.dayLabel}>D{i + 1}</div>
            <div style={styles.dayState}>{stateLabels[state]}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    width: '100%',
    overflowX: 'auto'
  },
  timeline: {
    display: 'flex',
    gap: '12px',
    padding: '12px 0',
    minWidth: 'min-content'
  },
  day: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    flex: '0 0 auto'
  },
  tile: {
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    opacity: 0.8,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.1)',
      opacity: 1,
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
    }
  },
  emoji: {
    fontSize: '1.8rem'
  },
  dayLabel: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase'
  },
  dayState: {
    fontSize: '0.7rem',
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    whiteSpace: 'nowrap'
  }
}
