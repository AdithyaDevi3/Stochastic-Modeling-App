import React from 'react'

export default function TransitionMatrix({ matrix, stateColors, stateLabels, stateEmojis }) {
  if (!matrix) return <p>No data available</p>

  const cellSize = 60

  return (
    <div style={styles.matrixContainer}>
      <div style={styles.matrixWrapper}>
        {/* Row labels on left */}
        <div style={styles.rowLabels}>
          <div style={styles.corner}></div>
          {[0, 1, 2, 3].map(state => (
            <div
              key={`row-${state}`}
              style={{
                ...styles.label,
                height: cellSize,
                lineHeight: `${cellSize}px`
              }}
            >
              <div style={styles.stateLabel}>
                <span style={styles.emoji}>{stateEmojis[state]}</span>
                <div style={styles.stateName}>{stateLabels[state]}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main matrix */}
        <div>
          {/* Column labels on top */}
          <div style={styles.columnLabels}>
            {[0, 1, 2, 3].map(state => (
              <div
                key={`col-${state}`}
                style={{
                  ...styles.label,
                  width: cellSize
                }}
              >
                <div style={styles.stateLabel}>
                  <span style={styles.emoji}>{stateEmojis[state]}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Matrix cells */}
          {[0, 1, 2, 3].map(i => (
            <div key={`row-cells-${i}`} style={styles.row}>
              {[0, 1, 2, 3].map(j => {
                const prob = matrix[i][j]
                const isDialogonal = i === j
                return (
                  <div
                    key={`cell-${i}-${j}`}
                    style={{
                      ...styles.cell,
                      width: cellSize,
                      height: cellSize,
                      background: stateColors[j],
                      opacity: 0.2 + prob * 0.8,
                      border: isDialogonal ? `2px solid ${stateColors[j]}` : '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: isDialogonal ? `0 0 12px ${stateColors[j]}40` : 'none'
                    }}
                    title={`P(${stateLabels[i]} → ${stateLabels[j]}) = ${prob.toFixed(3)}`}
                  >
                    <span style={styles.cellValue}>{(prob * 100).toFixed(0)}%</span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        <p style={styles.legendTitle}>Legend:</p>
        <div style={styles.legendItems}>
          {[0, 1, 2, 3].map(state => (
            <div key={`legend-${state}`} style={styles.legendItem}>
              <span style={styles.emoji}>{stateEmojis[state]}</span>
              <span style={styles.legendLabel}>{stateLabels[state]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  matrixContainer: {
    overflowX: 'auto'
  },
  matrixWrapper: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px'
  },
  rowLabels: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0'
  },
  corner: {
    width: 60,
    height: 60
  },
  columnLabels: {
    display: 'flex',
    gap: '0',
    marginBottom: '0'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 600,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  stateLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  },
  stateName: {
    fontSize: '0.65rem',
    whiteSpace: 'nowrap'
  },
  emoji: {
    fontSize: '1.2rem'
  },
  row: {
    display: 'flex',
    gap: '0'
  },
  cell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#ffffff',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
    '&:hover': {
      transform: 'scale(1.05)'
    }
  },
  cellValue: {
    pointerEvents: 'none'
  },
  legend: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '12px',
    marginTop: '12px'
  },
  legendTitle: {
    fontSize: '0.85rem',
    fontWeight: 600,
    marginBottom: '8px',
    color: 'rgba(255, 255, 255, 0.7)'
  },
  legendItems: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '8px'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.8)'
  }
}
