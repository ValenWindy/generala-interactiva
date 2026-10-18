export const CATEGORIES = [
  { id: 'ones', label: '1', target: 1 },
  { id: 'twos', label: '2', target: 2 },
  { id: 'threes', label: '3', target: 3 },
  { id: 'fours', label: '4', target: 4 },
  { id: 'fives', label: '5', target: 5 },
  { id: 'sixes', label: '6', target: 6 },
  { id: 'straight', label: 'Escalera' },
  { id: 'full', label: 'Full' },
  { id: 'poker', label: 'Poker' },
  { id: 'generala', label: 'Generala' },
  { id: 'generala-doble', label: 'Generala Doble' },
]

const NUMBER_CATEGORY = new Set(['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'])
const SERVIDA_BONUS = 5

// Orden de especiales de mayor a menor, para el cartel emergente
const SPECIAL_IDS = ['generala-doble', 'generala', 'poker', 'full', 'straight']

function countValues(values) {
  const counts = {}
  for (const v of values) counts[v] = (counts[v] || 0) + 1
  return counts
}

function isStraight(values) {
  const sorted = [...values].sort((a, b) => a - b).join('')
  return sorted === '12345' || sorted === '23456'
}

function isFull(counts) {
  const groups = Object.values(counts)
  return groups.includes(3) && groups.includes(2)
}

function isPoker(counts) {
  return Object.values(counts).some((n) => n >= 4)
}

function isGenerala(counts) {
  return Object.values(counts).some((n) => n === 5)
}

function servidaBonus(rollCount, achieved) {
  return achieved && rollCount === 1 ? SERVIDA_BONUS : 0
}

// context: { rollCount, generalaScored }
export function calculateScore(categoryId, values, context = {}) {
  const { rollCount = null, generalaScored = false } = context
  if (values.some((v) => v === null) || values.length !== 5) return 0

  if (NUMBER_CATEGORY.has(categoryId)) {
    const target = CATEGORIES.find((c) => c.id === categoryId).target
    return values.filter((v) => v === target).length * target
  }

  const counts = countValues(values)

  switch (categoryId) {
    case 'straight': {
      const achieved = isStraight(values)
      return achieved ? 20 + servidaBonus(rollCount, achieved) : 0
    }
    case 'full': {
      const achieved = isFull(counts)
      return achieved ? 30 + servidaBonus(rollCount, achieved) : 0
    }
    case 'poker': {
      const achieved = isPoker(counts)
      return achieved ? 40 + servidaBonus(rollCount, achieved) : 0
    }
    case 'generala': {
      const achieved = isGenerala(counts)
      return achieved ? 50 + servidaBonus(rollCount, achieved) : 0
    }
    case 'generala-doble': {
      if (!generalaScored) return 0
      const achieved = isGenerala(counts)
      return achieved ? 100 + servidaBonus(rollCount, achieved) : 0
    }
    default:
      return 0
  }
}

// Detecta el especial más valioso logrado con esta tirada, para el cartel emergente.
// No depende de si ya se anotó: es solo para festejar lo que salió en la mesa.
export function detectSpecial(values, rollCount, generalaScored) {
  if (values.some((v) => v === null) || values.length !== 5) return null

  for (const id of SPECIAL_IDS) {
    const score = calculateScore(id, values, { rollCount, generalaScored })
    if (score > 0) {
      const category = CATEGORIES.find((c) => c.id === id)
      return { id, label: category.label, score, servida: rollCount === 1 }
    }
  }

  return null
}
