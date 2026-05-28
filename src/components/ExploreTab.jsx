import React from 'react'
import TransitionMatrix from './TransitionMatrix'
import StationaryDistributionChart from './StationaryDistributionChart'
import HistoryGrid from './HistoryGrid'

export default function ExploreTab({ data, stateColors, stateLabels, stateEmojis }) {
  return (
    <div style={styles.container}>
      {/* Transition Matrix */}
      <div style={styles.section}>
        <h2 style={styles.heading}>Transition Matrix</h2>
        <p style={styles.description}>
          This matrix shows the probability of transitioning from one weather state to another. 
          Each row represents today's state, and each column represents tomorrow's state. 
          A value of 0.5 means there's a 50% chance of that transition occurring.
        </p>
        <TransitionMatrix 
          matrix={data.transitionMatrix}
          stateColors={stateColors}
          stateLabels={stateLabels}
          stateEmojis={stateEmojis}
        />
      </div>

      {/* Two-column layout for charts and history */}
      <div style={styles.twoColumn}>
        {/* Stationary Distribution */}
        <div style={styles.section}>
          <h3 style={styles.heading}>Long-Run Distribution</h3>
          <p style={styles.description}>
            Over the long term, weather settles into a pattern. This chart shows what fraction 
            of days fall into each state in the equilibrium distribution.
          </p>
          <StationaryDistributionChart
            distribution={data.stationaryDistribution}
            stateColors={stateColors}
            stateLabels={stateLabels}
            stateEmojis={stateEmojis}
          />
        </div>

        {/* History Grid */}
        <div style={styles.section}>
          <h3 style={styles.heading}>Last 30 Days</h3>
          <p style={styles.description}>
            A visual timeline of the actual weather observed over the past month. 
            This data is used to compute the transition matrix.
          </p>
          <HistoryGrid
            states={data.dailyStates.slice(-30)}
            stateColors={stateColors}
            stateLabels={stateLabels}
            stateEmojis={stateEmojis}
          />
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
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
  },
  twoColumn: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr'
    }
  }
}
