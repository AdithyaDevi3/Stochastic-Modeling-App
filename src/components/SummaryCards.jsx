import React from 'react'

export default function SummaryCards({ forecast, stateColors, stateLabels, stateEmojis }) {
  const counts = [0, 0, 0, 0]
  forecast.forEach(state => {
    counts[state]++
  })

  const total = forecast.length

  return (
    <div style={styles.grid}>
      {[0, 1, 2, 3].map(state => {
        const count = counts[state]
        const percentage = ((count / total) * 100).toFixed(1)

        return (
          <div
            key={`card-${state}`}
            style={{
              ...styles.card,
              borderLeftColor: stateColors[state]
            }}
          >
            <div style={styles.cardHeader}>
              <span style={styles.emoji}>{stateEmojis[state]}</span>
              <h4 style={styles.cardTitle}>{stateLabels[state]}</h4>
            </div>

            <div style={styles.cardStats}>
              <div style={styles.stat}>
                <span style={styles.statLabel}>Days</span>
                <span style={styles.statValue}>{count}</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statLabel}>Percentage</span>
                <span style={styles.statValue}>{percentage}%</span>
              </div>
            </div>

            {/* Progress bar */}
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${percentage}%`,
                  backgroundColor: stateColors[state]
                }}
              ></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px'
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderLeft: '4px solid',
    borderRadius: '12px',
    padding: '16px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.08)',
      transform: 'translateY(-2px)'
    }
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px'
  },
  emoji: {
    fontSize: '1.5rem'
  },
  cardTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    margin: 0
  },
  cardStats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '12px'
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  statLabel: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: 600
  },
  statValue: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#ffffff'
  },
  progressBar: {
    width: '100%',
    height: '6px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease'
  }
}
