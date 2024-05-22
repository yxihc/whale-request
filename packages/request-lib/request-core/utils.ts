export function actualErrorRetryInterval(retriedCount: number) {
  if (retriedCount < 1) {
    return 0
  }
  const baseTime = 1000
  const minCoefficient = 1
  const maxCoefficient = 9
  // When retrying for the first time, in order to avoid the coefficient being 0
  // so replace 0 with 2, the coefficient range will become 1 - 2
  const coefficient = Math.floor(
    Math.random() * 2 ** Math.min(retriedCount, maxCoefficient) + minCoefficient
  )
  return baseTime * coefficient
}
