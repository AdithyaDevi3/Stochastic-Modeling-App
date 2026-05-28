/**
 * Fetch weather data from Open-Meteo API
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Array>} Array of daily weather objects
 */
export async function fetchWeatherData(lat, lon) {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.append('latitude', lat)
  url.searchParams.append('longitude', lon)
  url.searchParams.append('daily', 'precipitation_sum,cloudcover_mean')
  url.searchParams.append('past_days', '90')
  url.searchParams.append('forecast_days', '1')
  url.searchParams.append('timezone', 'auto')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.statusText}`)
  }

  const json = await response.json()
  
  // Combine daily data with dates
  const dates = json.daily.time
  const precipitation = json.daily.precipitation_sum
  const cloudcover = json.daily.cloudcover_mean

  return dates.map((date, i) => ({
    date,
    precipitation_sum: precipitation[i],
    cloudcover_mean: cloudcover[i]
  }))
}

/**
 * Classify a day into a weather state
 * 0: Sunny (cloudcover < 30% AND precip < 1mm)
 * 1: Partly Cloudy (30% <= cloudcover < 60% AND precip < 1mm)
 * 2: Cloudy (cloudcover >= 60% AND precip < 1mm)
 * 3: Rainy (precip >= 1mm)
 */
export function classifyDay(cloudcover, precip) {
  if (precip >= 1) {
    return 3 // Rainy
  }
  if (cloudcover < 30) {
    return 0 // Sunny
  }
  if (cloudcover < 60) {
    return 1 // Partly Cloudy
  }
  return 2 // Cloudy
}

/**
 * Build transition matrix from state sequence
 * @param {Array<number>} states - Array of state indices (0-3)
 * @returns {Array<Array<number>>} 4x4 transition probability matrix
 */
export function buildTransitionMatrix(states) {
  // Initialize 4x4 count matrix
  const counts = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]

  // Count transitions
  for (let i = 0; i < states.length - 1; i++) {
    const from = states[i]
    const to = states[i + 1]
    counts[from][to]++
  }

  // Row-normalize to probabilities
  const matrix = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]

  for (let i = 0; i < 4; i++) {
    const rowSum = counts[i].reduce((a, b) => a + b, 0)
    if (rowSum === 0) {
      // If no transitions from state i, use uniform distribution
      for (let j = 0; j < 4; j++) {
        matrix[i][j] = 0.25
      }
    } else {
      for (let j = 0; j < 4; j++) {
        matrix[i][j] = counts[i][j] / rowSum
      }
    }
  }

  return matrix
}

/**
 * Compute stationary distribution using power iteration
 * @param {Array<Array<number>>} matrix - Transition probability matrix
 * @returns {Array<number>} Stationary distribution [π₀, π₁, π₂, π₃]
 */
export function computeStationaryDistribution(matrix) {
  // Start with uniform distribution
  let pi = [0.25, 0.25, 0.25, 0.25]

  // Power iterate for 1000 iterations
  for (let iteration = 0; iteration < 1000; iteration++) {
    const newPi = [0, 0, 0, 0]
    
    // π_{t+1} = π_t × P
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 4; i++) {
        newPi[j] += pi[i] * matrix[i][j]
      }
    }

    pi = newPi
  }

  return pi
}

/**
 * Simulate a forecast path using the transition matrix
 * @param {number} startState - Initial state (0-3)
 * @param {Array<Array<number>>} matrix - Transition probability matrix
 * @param {number} days - Number of days to forecast
 * @returns {Array<number>} Forecast path
 */
export function simulateForecast(startState, matrix, days) {
  const path = [startState]
  let currentState = startState

  for (let i = 0; i < days - 1; i++) {
    const probabilities = matrix[currentState]
    // Sample next state from current row of matrix
    const random = Math.random()
    let cumulative = 0
    let nextState = 0

    for (let j = 0; j < 4; j++) {
      cumulative += probabilities[j]
      if (random < cumulative) {
        nextState = j
        break
      }
    }

    path.push(nextState)
    currentState = nextState
  }

  return path
}
