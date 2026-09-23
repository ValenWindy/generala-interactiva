import { useState } from 'react'
import RulesModal from './RulesModal'
import '../styles/start-screen.css'

const MAX_PLAYERS = 4

export default function StartScreen({ onStart }) {
  const [mode, setMode] = useState(null) // null | 'common'
  const [showRules, setShowRules] = useState(false)
  const [playersDraft, setPlayersDraft] = useState([{ id: 1, name: '', isCPU: false }])

  function playPractice() {
    onStart([{ id: 'human', name: 'Jugador', isCPU: false }])
  }

  function updateName(id, value) {
    setPlayersDraft((prev) => prev.map((p) => (p.id === id ? { ...p, name: value } : p)))
  }

  function setAsCPU(id) {
    setPlayersDraft((prev) => {
      const cpuCount = prev.filter((p) => p.isCPU).length
      return prev.map((p) =>
        p.id === id ? { ...p, isCPU: true, name: `CPU ${cpuCount + 1}` } : p
      )
    })
  }

  function setAsPlayer(id) {
    setPlayersDraft((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isCPU: false, name: '' } : p))
    )
  }

  function addPlayer() {
    setPlayersDraft((prev) =>
      prev.length < MAX_PLAYERS ? [...prev, { id: Date.now(), name: '', isCPU: false }] : prev
    )
  }

  function removePlayer(id) {
    setPlayersDraft((prev) => prev.filter((p) => p.id !== id))
  }

  const canStart = playersDraft.length >= 2 && playersDraft.every((p) => p.name.trim())

  function startCommon(e) {
    e.preventDefault()
    if (!canStart) return
    onStart(playersDraft.map((p) => ({ id: String(p.id), name: p.name.trim(), isCPU: p.isCPU })))
  }

  if (mode === 'common') {
    return (
      <main className="start">
        <h1 className="start__title">GENERALA</h1>
        <form className="start__form" onSubmit={startCommon}>
          <p className="start__hint start__hint--muted">
            Tocá el botón para alternar ese jugador entre Jugador y CPU.
          </p>

          {playersDraft.map((p, index) => (
            <div className="player-slot" key={p.id}>
              <span className="player-slot__number">{index + 1}</span>
              <input
                className="start__input"
                value={p.name}
                onChange={(e) => updateName(p.id, e.target.value)}
                placeholder={index === 0 ? 'Tu nombre' : 'Nombre del jugador'}
                disabled={p.isCPU}
                maxLength={20}
                autoFocus={index === 0}
              />
              {index > 0 &&
                (p.isCPU ? (
                  <button type="button" className="player-slot__btn" onClick={() => setAsPlayer(p.id)}>
                    Jugador
                  </button>
                ) : (
                  <button type="button" className="player-slot__btn" onClick={() => setAsCPU(p.id)}>
                    CPU
                  </button>
                ))}
              {index > 0 && (
                <button
                  type="button"
                  className="player-slot__remove"
                  onClick={() => removePlayer(p.id)}
                  aria-label="Quitar jugador"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          {playersDraft.length < MAX_PLAYERS && (
            <button type="button" className="btn btn--ghost" onClick={addPlayer}>
              + Agregar jugador
            </button>
          )}

          {!canStart && (
            <p className="start__hint">Necesitás al menos 2 jugadores, todos con nombre.</p>
          )}

          <div className="start__actions">
            <button type="button" className="btn btn--ghost" onClick={() => setMode(null)}>
              Volver
            </button>
            <button type="submit" className="btn" disabled={!canStart}>
              Jugar
            </button>
          </div>

          <button type="button" className="start__rules-link" onClick={() => setShowRules(true)}>
            ¿Cómo se juega?
          </button>
        </form>

        {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      </main>
    )
  }

  return (
    <main className="start">
      <h1 className="start__title">GENERALA</h1>
      <div className="start__modes">
        <button className="btn" onClick={playPractice}>
          Modo Práctica
        </button>
        <button className="btn btn--outline" onClick={() => setMode('common')}>
          Modo Común (hasta 4 jugadores)
        </button>
      </div>

      <button type="button" className="start__rules-link" onClick={() => setShowRules(true)}>
        ¿Cómo se juega?
      </button>

      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
    </main>
  )
}
