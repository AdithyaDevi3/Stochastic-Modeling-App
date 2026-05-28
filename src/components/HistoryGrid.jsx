import React from 'react'

export default function HistoryGrid({ states, stateColors, stateLabels, stateEmojis }) {
  const stateCounts = [0, 0, 0, 0]
  states.forEach(state => {
    stateCounts[state]++
  })

  return (
    <div style={styles.container}>
      {/* Grid of emoji tiles */}
      <div style={styles.grid}>
        {states.map((state, i) => (
          <div
            key={`day-${i}`}
            style={{
              ...styles.tile,
              background: stateColors[state],
              opacity: 0.7
            }}
            title={`Day ${i + 1}: ${stateLabels[state]}`}
          >
            <span style={styles.emoji}>{stateEmojis[state]}</span>
          </div>
        ))}
      </div>

      {/* Summary counts */}
      <div style={styles.summary}>
        <p style={styles.summaryTitle}>Summary</p>
        <div style={styles.counts}>
          {[0, 1, 2, 3].map(state => (
            <div key={`count-${state}`} style={styles.countItem}>
              <span style={styles.countEmoji}>{stateEmojis[state]}</span>
              <span style={styles.countLabel}>{stateLabels[state]}</span>
              <span style={styles.countValue}>{stateCounts[state]} days</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    width: '100%'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
    gap: '6px',
    marginBottom: '16px'
  },
  tile: {
    aspectRatio: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
    }
  },
  emoji: {
    fontSize: '1.2rem'
  },
  summary: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '12px'
  },
  summaryTitle: {
    fontSize: '0.85rem',
    fontWeight: 600,
    marginBottom: '8px',
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  counts: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px'
  },
  countItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px',
    fontSize: '0.8rem'
  },
  countEmoji: {
    fontSize: '1rem'
  },
  countLabel: {
    flex: 1,
    color: 'rgba(255, 255, 255, 0.6)',
    whiteSpace: 'nowrap'
  },
  countValue: {
    fontWeight: 700,
    color: '#ffffff'
  }
}
