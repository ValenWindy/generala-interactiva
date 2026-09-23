import '../styles/dice.css'

const PIP_CELLS = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
}

export default function Dice({
  value,
  held = false,
  marked = false,
  returning = false,
  disabled = false,
  rolled = false,
  rollDelay = 0,
  onClick,
}) {
  const pipCells = PIP_CELLS[value]

  const classes = ['dice']
  if (held) classes.push('dice--held')
  if (marked) classes.push('dice--marked')
  if (returning) classes.push('dice--returning')
  if (rolled) classes.push('dice--rolled')

  return (
    <button
      type="button"
      className={classes.join(' ')}
      style={rolled || returning ? { animationDelay: `${rollDelay}ms` } : undefined} 
      onClick={onClick}
      disabled={disabled || returning}
      aria-pressed={held || marked}
      aria-label={`Dado con valor ${value}${
        held ? ', guardado' : marked ? ', marcado para guardar' : ''
      }`}
    >
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className={`dice__cell ${pipCells.includes(i) ? 'dice__cell--pip' : ''}`} />
      ))}
    </button>
  )
}
