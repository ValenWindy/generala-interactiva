import { rollDie } from './dice'
import { CATEGORIES, calculateScore } from './scoring'

// Estrategia simple: si algún valor aparece 2 o más veces, lo conserva y relanza el resto
function chooseHolds(values) {
  const counts = {}
  values.forEach((v) => {
    counts[v] = (counts[v] || 0) + 1
  })

  let bestValue = null
  let bestCount = 1
  Object.entries(counts).forEach(([v, c]) => {
    if (c > bestCount) {
      bestCount = c
      bestValue = v
    }
  })

  if (bestValue === null) return values.map(() => false)
  return values.map((v) => String(v) === bestValue)
}

// Un paso de lanzamiento de la CPU: guarda los dados prometedores y relanza el resto
export function cpuRollStep(dice) {
  const values = dice.map((d) => d.value)
  const allEmpty = values.every((v) => v === null)
  const holds = allEmpty ? dice.map(() => false) : chooseHolds(values)

  return dice.map((die, i) => ({
    ...die,
    held: holds[i],
    value: holds[i] ? die.value : rollDie(),
    fresh: !holds[i],
  }))
}

// Elige, entre las categorías libres, la que da más puntos con los dados actuales
export function cpuChooseCategory(values, scores, rollCount, generalaScored) {
  let bestId = null
  let bestScore = -1

  for (const { id } of CATEGORIES) {
    if (scores[id] !== undefined) continue
    const score = calculateScore(id, values, { rollCount, generalaScored })
    if (score > bestScore) {
      bestScore = score
      bestId = id
    }
  }

  if (bestId === null) {
    bestId = CATEGORIES.find(({ id }) => scores[id] === undefined)?.id ?? null
  }

  return bestId
}
