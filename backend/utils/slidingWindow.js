function slidingAverage(readings, n) {
  // readings: array of { units }
  if (!Array.isArray(readings) || readings.length === 0) return 0;
  // k=window size
  const k = Math.max(1, Math.min(n, readings.length));
  let sum = 0;
  for (let i = readings.length - k; i < readings.length; i++) {
    sum += Number(readings[i].units) || 0;
  }
  return sum / k;//divide by window size to get the average
}

module.exports = { slidingAverage };
