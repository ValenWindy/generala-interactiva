import { useEffect, useRef, useState } from 'react'
import '../styles/dice-cup.css'

// ---- Ajustes de la interacción ----
const FOLLOW = 0.35 // fracción del movimiento del puntero que sigue el vaso
const MAX_OFFSET = 60 // px máximos que el vaso puede alejarse de su lugar
const TILT = 0.25 // grados de inclinación por px de desplazamiento horizontal
const MIN_STEP = 6 // px: movimientos menores se ignoran (temblor de la mano)
const MIN_SHAKE_DISTANCE = 300 // px recorridos para considerar que se sacudió
const MIN_REVERSALS = 3 // cambios de dirección necesarios (ida y vuelta)
const THROW_MS = 900 // duración de la animación del vaso al lanzar

const clamp = (n, min, max) => Math.min(max, Math.max(min, n))

export default function DiceCup({ disabled = false, onRoll }) {
  // 'idle' (quieto) | 'dragging' (agarrado) | 'throwing' (animando el lanzamiento)
  const [phase, setPhase] = useState('idle')
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [shaken, setShaken] = useState(false)

  // Datos del gesto en curso. Van en un ref porque no necesitan re-renderizar.
  const drag = useRef(null)

  // Cuando termina la animación, el vaso vuelve a quedar disponible
  useEffect(() => {
    if (phase !== 'throwing') return

    const id = setTimeout(() => {
      setOffset({ x: 0, y: 0 })
      setPhase('idle')
    }, THROW_MS)

    return () => clearTimeout(id)
  }, [phase])

  function handlePointerDown(e) {
    if (disabled || phase !== 'idle' || drag.current) return
    if (e.pointerType === 'mouse' && e.button !== 0) return

    // Sigue recibiendo eventos aunque el puntero salga del vaso
    e.currentTarget.setPointerCapture(e.pointerId)

    drag.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      dir: null, // última dirección de movimiento
      distance: 0, // recorrido total
      reversals: 0, // cambios de dirección
      shaken: false,
    }
    setPhase('dragging')
  }

  function handlePointerMove(e) {
    const d = drag.current
    if (!d || e.pointerId !== d.pointerId) return

    // 1) El vaso sigue parcialmente el movimiento
    setOffset({
      x: clamp((e.clientX - d.startX) * FOLLOW, -MAX_OFFSET, MAX_OFFSET),
      y: clamp((e.clientY - d.startY) * FOLLOW, -MAX_OFFSET, MAX_OFFSET),
    })

    // 2) Medir la sacudida
    const dx = e.clientX - d.lastX
    const dy = e.clientY - d.lastY
    const step = Math.hypot(dx, dy)
    if (step < MIN_STEP) return // se acumula hasta superar el mínimo

    d.distance += step
    // Producto punto negativo = el movimiento va en sentido contrario al anterior
    if (d.dir && dx * d.dir.x + dy * d.dir.y < 0) d.reversals += 1
    d.dir = { x: dx, y: dy }
    d.lastX = e.clientX
    d.lastY = e.clientY

    if (!d.shaken && d.distance >= MIN_SHAKE_DISTANCE && d.reversals >= MIN_REVERSALS) {
      d.shaken = true
      setShaken(true)
    }
  }

  function finishDrag(e, cancelled) {
    const d = drag.current
    if (!d || e.pointerId !== d.pointerId) return
    drag.current = null
    setShaken(false)

    if (!cancelled && d.shaken) {
      // Sacudido y soltado: se lanza. El offset se mantiene para que la
      // animación arranque desde donde estaba el vaso.
      setPhase('throwing')
      onRoll()
    } else {
      // No alcanzó la sacudida (o se canceló el gesto): vuelve a su lugar
      setOffset({ x: 0, y: 0 })
      setPhase('idle')
    }
  }

  const classes = ['dice-cup']
  if (phase === 'dragging') classes.push('dice-cup--dragging')
  if (phase === 'throwing') classes.push('dice-cup--throwing')
  if (shaken) classes.push('dice-cup--ready')
  if (disabled && phase === 'idle') classes.push('dice-cup--disabled')

  return (
    <div
      className={classes.join(' ')}
      style={{
        '--x': `${offset.x}px`,
        '--y': `${offset.y}px`,
        '--rot': `${offset.x * TILT}deg`,
        '--throw-ms': `${THROW_MS}ms`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={(e) => finishDrag(e, false)}
      onPointerCancel={(e) => finishDrag(e, true)}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="dice-cup__body">
        <span className="dice-cup__label">Vaso</span>
      </div>
      {shaken && <span className="dice-cup__hint">¡Soltá!</span>}
    </div>
  )
}
