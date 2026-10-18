import { useState } from 'react'
import '../styles/dice-cup.css'

const MIN_HOLD_MS = 300 // mínimo que hay que mantener presionado para que cuente como sacudida
const THROW_MS = 900 // duración de la animación del vaso al lanzar

export default function DiceCup({ disabled = false, onRoll }) {
  const [phase, setPhase] = useState('idle') // 'idle' | 'holding' | 'throwing'
  const [holdStart, setHoldStart] = useState(null)

  function handlePointerDown(e) {
    if (disabled || phase !== 'idle') return
    if (e.pointerType === 'mouse' && e.button !== 0) return

    e.currentTarget.setPointerCapture(e.pointerId)
    setHoldStart(Date.now())
    setPhase('holding')
  }

  // Soltar el vaso es lo que dispara el lanzamiento (si se sostuvo lo suficiente)
  function handleRelease() {
    if (phase !== 'holding') return

    const held = holdStart ? Date.now() - holdStart : 0
    setHoldStart(null)

    if (held >= MIN_HOLD_MS) {
      setPhase('throwing')
      onRoll()
    } else {
      setPhase('idle')
    }
  }

  // Cuando termina la animación del vaso, vuelve a estar disponible
  function handleAnimationEnd() {
    if (phase === 'throwing') setPhase('idle')
  }

  const classes = ['dice-cup']
  if (phase === 'holding') classes.push('dice-cup--holding')
  if (phase === 'throwing') classes.push('dice-cup--throwing')
  if (disabled && phase === 'idle') classes.push('dice-cup--disabled')

  return (
    <button
      type="button"
      className={classes.join(' ')}
      style={{ '--throw-ms': `${THROW_MS}ms` }}
      onPointerDown={handlePointerDown}
      onPointerUp={handleRelease}
      onPointerCancel={handleRelease}
      onAnimationEnd={handleAnimationEnd}
      onContextMenu={(e) => e.preventDefault()}
      disabled={disabled && phase === 'idle'}
    >
      <div className="dice-cup__body">
        <span className="dice-cup__label">Vaso</span>
      </div>
    </button>
  )
}
