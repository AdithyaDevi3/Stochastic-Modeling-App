import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function StationaryDistributionChart({ distribution, stateColors, stateLabels, stateEmojis }) {
  if (!distribution) return <p>No data available</p>

  const data = [0, 1, 2, 3].map(state => ({
    state: stateEmojis[state],
    label: stateLabels[state],
    value: distribution[state] * 100,
    fill: stateColors[state]
  }))

  return (
    <div style={styles.container}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            dataKey="state" 
            tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }}
            tickLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
          />
          <YAxis 
            label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
            tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
            tickLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
          />
          <Tooltip 
            contentStyle={{
              background: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#ffffff'
            }}
            formatter={(value, name, props) => [
              `${value.toFixed(1)}%`,
              props.payload.label
            ]}
            labelStyle={{ color: '#ffffff' }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Stats below chart */}
      <div style={styles.stats}>
        {distribution.map((value, i) => (
          <div key={`stat-${i}`} style={styles.stat}>
            <span style={styles.statEmoji}>{stateEmojis[i]}</span>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>{stateLabels[i]}</div>
              <div style={styles.statValue}>{(value * 100).toFixed(1)}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    width: '100%'
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginTop: '16px'
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px'
  },
  statEmoji: {
    fontSize: '1.5rem'
  },
  statContent: {
    flex: 1
  },
  statLabel: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  statValue: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#ffffff'
  }
}
